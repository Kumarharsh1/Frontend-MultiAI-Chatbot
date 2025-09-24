import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import ChatSelector from '../components/ChatSelector';
import { getAvailableServices } from '../utils/api';

export default function Home() {
  const [activeChatbot, setActiveChatbot] = useState('news');
  const [service, setService] = useState('groq');
  const [availableServices, setAvailableServices] = useState({});
  const [connectionError, setConnectionError] = useState(null);

  const testBackendConnection = async () => {
    try {
      const data = await getAvailableServices();
      setAvailableServices(data || {});
    } catch (err) {
      setConnectionError(`Cannot connect to backend: ${err.message}`);
      setAvailableServices({ groq: true, databricks: true });
    }
  };

  useEffect(() => { testBackendConnection(); }, []);

  const chatbotConfigs = {
    news: { name: "News Assistant", description: "Get the latest news", icon: "📰", color: "from-blue-500 to-purple-600" },
    personal: { name: "Personal Assistant", description: "Helpful companion", icon: "🤝", color: "from-green-500 to-teal-600" },
    creative: { name: "Creative Assistant", description: "Spark creativity", icon: "🎨", color: "from-pink-500 to-rose-600" },
    technical: { name: "Technical Assistant", description: "Technical & coding help", icon: "💻", color: "from-orange-500 to-red-600" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-black-900 via-silver-black-800 to-silver-black-900">
      <header className="bg-silver-black-900/80 backdrop-blur-lg border-b border-silver-black-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white font-bold">MultiAI Chatbot</h1>
          <ChatSelector
            availableServices={availableServices || {}}
            activeChatbot={activeChatbot}
            setActiveChatbot={setActiveChatbot}
            chatbotConfigs={chatbotConfigs}
          />
        </div>
      </header>

      <main className="p-4 flex-1">
        <ChatInterface
          chatbotType={activeChatbot}
          service={service}
          chatbotConfig={chatbotConfigs[activeChatbot]}
          connectionError={connectionError}
        />
      </main>
    </div>
  );
}
