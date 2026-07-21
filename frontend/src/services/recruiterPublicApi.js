import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

function extractError(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

export async function getRecruiterLandingMetrics() {
  try {
    const response = await api.get("/public/recruiter/metrics");
    return response.data.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
}

export async function submitDemoRequest(payload) {
  try {
    const response = await api.post(
      "/public/recruiter/demo-requests",
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
}

export async function startRecruiterTrial(payload) {
  try {
    const response = await api.post(
      "/public/recruiter/trial-signups",
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error(extractError(error));
  }
}