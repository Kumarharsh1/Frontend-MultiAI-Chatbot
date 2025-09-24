import { useState, useEffect, useRef } from 'react'
import ChatInterface from '../components/ChatInterface'
import ChatSelector from '../components/ChatSelector'
import { Brain, Github, Mail, Phone, MapPin } from 'lucide-react'

export default function Home() {
  const [activeChatbot, setActiveChatbot] = useState('news')
  const [service, setService] = useState('groq')
  const [availableServices, setAvailableServices] = useState({})

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

    fetch(`${API_BASE}/api/v1/services`)
      .then(res => res.json())
      .then(data => setAvailableServices(data))
      .catch(err => console.error('Error fetching services:', err))
  }, [])

  const chatbotConfigs = {
    news: {
      name: "News Assistant",
      description: "Get the latest news and updates",
      icon: "📰",
      color: "from-blue-500 to-purple-600"
    },
    personal: {
      name: "Personal Assistant", 
      description: "Your helpful personal companion",
      icon: "🤝",
      color: "from-green-500 to-teal-600"
    },
    creative: {
      name: "Creative Assistant",
      description: "Spark your creativity and imagination", 
      icon: "🎨",
      color: "from-pink-500 to-rose-600"
    },
    technical: {
      name: "Technical Assistant",
      description: "Get technical help and coding assistance",
      icon: "💻",
      color: "from-orange-500 to-red-600"
    }
  }

  return (
    <div className="min-h-screen silver-black-bg">
      {/* Header */}
      <header className="bg-silver-black-900/50 backdrop-blur-lg border-b border-silver-black-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="gradient-bg p-3 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MultiAI Chatbot
                </h1>
                <p className="text-silver-black-300">Powered by Groq & Databricks</p>
              </div>
            </div>
            
            {/* Service Selector */}
            <div className="flex items-center space-x-4">
              <select 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-silver-black-800 border border-silver-black-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="groq" disabled={!availableServices.groq}>
                  Groq {!availableServices.groq && '(Unavailable)'}
                </option>
                <option value="databricks" disabled={!availableServices.databricks}>
                  Databricks {!availableServices.databricks && '(Unavailable)'}
                </option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ChatSelector
              activeChatbot={activeChatbot}
              setActiveChatbot={setActiveChatbot}
              configs={chatbotConfigs}
            />
            
            {/* Author Info */}
            <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl p-6 mt-6 border border-silver-black-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="gradient-bg p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Made By Kumar Harsh</h3>
                  <p className="text-sm text-silver-black-300">India</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-silver-black-300">
                  <Mail className="h-4 w-4" />
                  <span>kh949118@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-silver-black-300">
                  <Phone className="h-4 w-4" />
                  <span>+91-9279157296</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl border border-silver-black-700 h-[600px] flex flex-col">
              <div className={`p-6 border-b border-silver-black-700 gradient-bg rounded-t-2xl`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{chatbotConfigs[activeChatbot].icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{chatbotConfigs[activeChatbot].name}</h2>
                    <p className="text-silver-black-200">{chatbotConfigs[activeChatbot].description}</p>
                  </div>
                </div>
              </div>
              
              <ChatInterface 
                chatbotType={activeChatbot}
                service={service}
                chatbotConfig={chatbotConfigs[activeChatbot]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
