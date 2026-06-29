# Drone Lab Audio MFCC Classification App Using CNN 

The application presented in the repository improves user accessibility to the housed CNN model. The frontend uses the React Native Expo platform, while the backend uses Flask and Supabase. 

## Folder Structure 

The Backend_Drone_Audio_MFCC folder houses all files related to the execution of the backend of the model. app.py must be running locally before running the frontend of the app. Once app.py is running, the frontend of the application 
may be accessed via the Frontend_Drone_Audio_MFCC folder. This folder contains React Native Expo app files. 

├── .gitignore 
├── README.md  
├── BackendDroneMfccApp/                         // Flask Python backend & ML model layer     
│   ├── app.py                                   // Main API router & preprocessing pipeline   
│   ├── newest_cnn_drone_mfcc_classifier.h5      // Trained CNN model weights                  
│   └── temp_audio/                              // Temporary directory for audio processing    
└── FrontendDroneMfccApp/                        // React Native Expo mobile/web application   
    ├── app/                                     // Expo Router application screens           
    ├── constants/                               // Network & local configuration scripts      
    ├── package.json                             // Frontend dependency manifest               
    └── tsconfig.json                            // TypeScript engine configuration           

## Tech Stack

The tech stack comprises of the following: 

### Frontend

- Core Framework: React Native with Expo SDK 54
- Language: Typescript
- Routing & Navigation: expo-router
- File / Media handling: expo-document-picker, expo-image-picker

### Backend

- Core Framework: Flask
- Audio Processing: Librosa
- Image Processing: Pillow
- Matrix Math: Numpy
- Security / CORS: flask_cors

### Machine Learning & Data Cloud

- Deep Learning Engine: Tensorflow / Keras
- Architecture: Convolutional Neural Network (CNN) evaluating a 128 x 128 x 3 BGR array scaled natively on a 0-255 integer footprint
- Data Platform: Supabase backend-as-a-service leveraging PostgreSQL ledger logs protected by matching Row Level Security (RLS) identity tags.

## Prerequisites

Before setting up the application, ensure the following environments and dependencies are installed globally on your machine:

- Node.js (v22.0.0 or higher): Required to support global native WebSockets (globalThis.WebSocket) during Expo's static web rendering phase.
- Python (v3.10-3.11): Required for the Flask framework and Tensorflow 2.21 ecosystem.

NOTE: FFmpeg Engine is required by the backend machine host if trying to decode raw compressed .m4a audio files uploaded directly from iOS mobile devices. The engine is not needed for MP3 or WAV file support.  

## Installation Instructions (Windows)

### 1. Backend Setup

Navigate to the backend and establish an isolated virtual environment:

  cd .\Backend_Drone_Audio_MFCC\
  python -m venv venv

Activate the runtime environment context (ensure execution policies allow execution scripts via Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process if needed):

  .\venv\Scripts\Activate.ps1

Install the backend package requirements:

  pip install tensorflow flask flask-cors librosa pillow numpy werkzeug

Verify newest_cnn_drone_mfcc_classifier.h5 is placed directly in the root of the BackendDroneMfccApp/ folder before running.

### 2. Frontend Seup

Open a separate terminal window, navigate to the frontend directory, and download the node modules:

  cd .\Frontend_Drone_Audio_MFCC\
  npm install

## Environment Variables

### Frontend Seup 

Create a .env file in the root of the Frontend_Drone_Audio_MFCC folder to declare your Supabase client connection parameters:

  EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project-url.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anonymous-public-key

### Subnet Routing Bridge (config.ts)

To test the software on a physical device over local Wi-Fi, open constants/config.ts and modify the machine identifier property:

  const LOCAL_IP = 'LOCAL_WIFI_IP_HERE'; 

## Build & Run Instructions

### 1. Initialize the Flask Backend Server

Always boot up the prediction server before attempting client requests. From the activated Python virtual environment terminal, execute:

  cd BackendDroneMfccApp
  .\venv\Scripts\Activate.ps1
  python app.py

The console will verify model integrity and host the entry endpoints at http://0.0.0.0:5000.

### 2. Initialize the Expo Frontend Client

In the frontend project directory terminal, start the Metro bundler engine:

  cd FrontendDroneMfccApp
  npm run start

### Deployment Testing Selection

From the interactive Metro command prompt, select your preferred target framework layer:

- Press w to run the browser client layout (http://localhost:8081).

- Scan the displayed QR code using the Expo Go application on your physical device to run mobile classifications directly over local Wi-Fi.
