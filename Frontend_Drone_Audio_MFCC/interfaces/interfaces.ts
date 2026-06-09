export interface User {
  id: string;
  email: string;
};

// export interface Classification {
//   id: string;
//   dronePrediction: string;
//   filename: string;
//   timestamp: string;
// }

export interface Classification {
  id: string;
  created_at: string;
  drone_model: string;
  confidence: string;
  filename: string;
  isaudio: boolean;
}

export interface PredictionResult {
  drone_model: string;
  confidence: string;
}
