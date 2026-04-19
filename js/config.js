// config.js
// Centralized configuration for SkillBridge frontend

// Detect environment automatically
let API_BASE;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  // Local development
  API_BASE = "http://localhost:5000";
} else {
  // Production (Render deployment)
  API_BASE = "https://skillbridge-jrc3.onrender.com";
}

// Export for use in other scripts
export { API_BASE };
