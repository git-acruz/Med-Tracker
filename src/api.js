// This will use the environment variable REACT_APP_API_BASE_URL if it exists (e.g., on Vercel)
// otherwise, it defaults to localhost for development.
const API_BASE = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; // the deployed backend URL or localhost

export default API_BASE;