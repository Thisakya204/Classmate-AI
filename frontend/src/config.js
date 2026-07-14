// API base URL configuration
// When running on Android phone, the app connects to the PC backend over Wi-Fi.
// Make sure your PC and phone are on the same Wi-Fi network and the backend is running.
// If your PC's IP changes, update this value and rebuild the APK.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.8.182:8000';

export default API_BASE_URL;
