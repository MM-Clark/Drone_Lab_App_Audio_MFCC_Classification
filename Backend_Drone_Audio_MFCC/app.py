import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS
import librosa
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 1. Load model globally
model = tf.keras.models.load_model('drone_crnn.keras')

CLASS_NAMES = [
    'Autel_Evo_II', 'DJI_Avata', 'DJI_FPV', 'DJI_Matrice200', 'DJI_Matrice200_v2',
    'DJI_Matrice600p', 'DJI_Mavic2pro', 'DJI_Mavic2s', 'DJI_Mavic_Air2', 'DJI_Mavic_Mini1',
    'DJI_Mavic_Mini2', 'DJI_Mini3', 'DJI_Mini3_pro', 'DJI_Neo', 'DJI_Phantom2', 
    'DJI_Phantom4', 'DJI_Tello', 'DJI_Tello_TT', 'David_Tricopter', 'Hasakee_Q11', 
    'Holystone_HS210', 'Hover_X1', 'PhenoBee', 'Swellpro_Splash3_plus', 'Syma_X20', 
    'Syma_X20P', 'Syma_X26', 'Syma_X5SW', 'Syma_X5UW', 'Syma_X8SW', 'UDI_U46', 
    'Yuneec_Typhoon_H_Plus'
]

TEMP_FOLDER = './temp_audio'
os.makedirs(TEMP_FOLDER, exist_ok=True)

# ==========================================
# ROUTE 1: IMAGE CLASSIFIER (Takes a PNG/JPG MFCC)
# ==========================================
@app.route('/predict', methods=['POST'])
def predict_mfcc():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
        image = image.resize((120, 120))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0) 

        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions, axis=1)[0])

        # Apply Softmax to convert raw logits into actual percentages
        probabilities = tf.nn.softmax(predictions[0])
        confidence = float(np.max(probabilities)) * 100

        return jsonify({
            'drone_model': CLASS_NAMES[predicted_index],
            'confidence': f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# ROUTE 2: AUDIO CLASSIFIER (Takes WAV/MP3, extracts MFCC, then predicts)
# ==========================================
@app.route('/predict_audio', methods=['POST'])
def predict_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filepath = None
    try:
        # 1. Save audio temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(TEMP_FOLDER, filename)
        file.save(filepath)

        # 2. Extract MFCC mathematically
        y, sr = librosa.load(filepath, sr=22050)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        
        # 3. Convert math array to the visual 120x120 format the model expects
        mfccs_normalized = ((mfccs - mfccs.min()) / (mfccs.max() - mfccs.min() + 1e-8) * 255).astype(np.uint8)
        img = Image.fromarray(mfccs_normalized).convert('RGB')
        img = img.resize((120, 120))
        
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0) 

        # 4. Predict
        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions, axis=1)[0])

        # Apply Softmax to convert raw logits into actual percentages
        probabilities = tf.nn.softmax(predictions[0])
        confidence = float(np.max(probabilities)) * 100

        return jsonify({
            'drone_model': CLASS_NAMES[predicted_index],
            'confidence': f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
    finally:
        # 5. Clean up disk space
        if filepath and os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)