import { useState, useEffect } from 'react'
import ChatInterface from '../components/ChatInterface'
import ChatSelector from '../components/ChatSelector'
import { Brain, Mail, Phone, MapPin, Wifi, WifiOff } from 'lucide-react'

export default function Home() {
  const [activeChatbot, setActiveChatbot] = useState('news')
  const [service, setService] = useState('groq')
  const [availableServices, setAvailableServices] = useState({})
  const [connectionError, setConnectionError] = useState(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

  const testBackendConnection = async () => {
    setIsTestingConnection(true)
    setConnectionError(null)
    
    try {
      console.log('Testing connection to:', `${API_BASE}/api/v1/services`)
      const response = await fetch(`${API_BASE}/api/v1/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      setAvailableServices(data)
      setConnectionError(null)
      console.log('Backend connection successful:', data)
    } catch (error) {
      console.error('Backend connection failed:', error)
      setConnectionError(`Cannot connect to backend: ${error.message}`)
      // Set default services for fallback
      setAvailableServices({ groq: true, databricks: true })
    } finally {
      setIsTestingConnection(false)
    }
  }

  useEffect(() => {
    testBackendConnection()
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
    <div className="min-h-screen bg-gradient-to-br from-silver-black-900 via-silver-black-800 to-silver-black-900">
      {/* Header */}
      <header className="bg-silver-black-900/80 backdrop-blur-lg border-b border-silver-black-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <p className="text-silver-black-300 text-sm">v{process.env.NEXT_PUBLIC_APP_VERSION}</p>
              </div>
            </div>
            
            {/* Connection Status & Service Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {connectionError ? (
                  <WifiOff className="h-5 w-5 text-red-400" />
                ) : (
                  <Wifi className="h-5 w-5 text-green-400" />
                )}
                <span className={`text-sm ${connectionError ? 'text-red-400' : 'text-green-400'}`}>
                  {connectionError ? 'Offline' : 'Online'}
                </span>
              </div>
              
              <select 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-silver-black-800 border border-silver-black-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!connectionError}
              >
                <option value="groq" disabled={!availableServices.groq}>
                  Groq {!availableServices.groq && '(Unavailable)'}
                </option>
                <option value="databricks" disabled={!availableServices.databricks}>
                  Databricks {!availableServices.databricks && '(Unavailable)'}
                </option>
              </select>

              <button
                onClick={testBackendConnection}
                disabled={isTestingConnection}
                className="bg-silver-black-700 hover:bg-silver-black-600 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isTestingConnection ? 'Testing...' : 'Reconnect'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ChatSelector
              activeChatbot={activeChatbot}
              setActiveChatbot={setActiveChatbot}
              configs={chatbotConfigs}
            />
            
            {/* Author Info */}
            <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl p-6 border border-silver-black-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
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
            <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl border border-silver-black-700 h-[600px] flex flex-col shadow-2xl">
              <div className={`p-6 border-b border-silver-black-700 bg-gradient-to-r ${chatbotConfigs[activeChatbot].color} rounded-t-2xl`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{chatbotConfigs[activeChatbot].icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{chatbotConfigs[activeChatbot].name}</h2>
                    <p className="text-white/80">{chatbotConfigs[activeChatbot].description}</p>
                  </div>
                </div>
              </div>
              
              <ChatInterface 
                chatbotType={activeChatbot}
                service={service}
                chatbotConfig={chatbotConfigs[activeChatbot]}
                connectionError={connectionError}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
