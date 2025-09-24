// Utility API functions
export async function getAvailableServices() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/services`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    // Provide defaults to prevent undefined
    return { groq: false, databricks: false, news: true, personal: true, creative: true, technical: true };
  }
}

export async function chatWithBackend({ message, chatbot_type, service, history = [] }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, chatbot_type, service, history })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return { content: "Failed to connect to backend.", error: "connection_error" };
  }
}
