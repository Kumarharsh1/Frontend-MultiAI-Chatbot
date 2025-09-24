// utils/api.js
export const chatWithBackend = async ({ message, chatbot_type = "personal", service = "databricks", history = [] }) => {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  try {
    const response = await fetch(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatbot_type, service, history }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend chat error:', error);
    return { content: "Sorry, backend is unreachable.", error: true };
  }
};

export const getAvailableServices = async () => {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const response = await fetch(`${API_BASE}/api/v1/services`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return { groq: true, databricks: true }; // fallback
  }
};
