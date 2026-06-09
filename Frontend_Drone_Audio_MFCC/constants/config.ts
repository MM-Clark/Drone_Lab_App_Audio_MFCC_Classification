// config.ts
import { Platform } from 'react-native';

// CRITICAL: Update this if your computer's local Wi-Fi IP changes.
const LOCAL_IP = '192.168.167.97';

export const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://127.0.0.1:5000' 
  : `http://${LOCAL_IP}:5000`;