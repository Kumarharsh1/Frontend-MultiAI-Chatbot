import { useState, useRef, useEffect } from 'react'
import { Send, Loader, AlertCircle } from 'lucide-react'
import MessageList from './MessageList'

const ChatInterface = ({ chatbotType, service, chatbotConfig, connectionError }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const messagesEndRef = useRef(null)

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Reset messages when chatbot changes
    setMessages([{
      role: 'assistant',
      content: getWelcomeMessage(chatbotType),
      timestamp: new Date().toISOString()
    }])
    setApiError(null)
  }, [chatbotType, service])

  const getWelcomeMessage = (type) => {
    const welcomeMessages = {
      news: "Hello! I'm your News Assistant. I can fetch the latest news updates for you. What would you like to know about today's news?",
      personal: "Hi there! I'm your Personal Assistant. How can I help you today? Whether it's advice, planning, or just conversation, I'm here for you!",
      creative: "Greetings! I'm your Creative Assistant. Ready to spark some creativity? Let's brainstorm, write, or create something amazing together!",
      technical: "Hello! I'm your Technical Assistant. I can help with coding, technical explanations, and problem-solving. What would you like to work on?"
    }
    return welcomeMessages[type] || "Hello! How can I assist you today?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || connectionError) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setApiError(null)

    try {
      console.log('Sending request to:', `${API_BASE}/api/v1/chat`)
      
      const response = await fetch(`${API_BASE}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          chatbot_type: chatbotType,
          service: service,
          history: messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (!data.content) {
        throw new Error('Invalid response format from backend')
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        model: data.model || service
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      setApiError(error.message)
      
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service. Please check if the backend is running properly.",
        timestamp: new Date().toISOString(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearError = () => {
    setApiError(null)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Connection Status */}
      {(connectionError || apiError) && (
        <div className="p-3 bg-red-500/20 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">
                {connectionError || apiError}
              </span>
            </div>
            <button 
              onClick={clearError}
              className="text-red-300 hover:text-white text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-silver-black-700 flex-shrink-0">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connectionError ? "Fix backend connection first..." : `Message ${chatbotConfig.name}...`}
            disabled={!!connectionError}
            className="flex-1 bg-silver-black-700 border border-silver-black-600 rounded-lg px-3 py-2 text-white placeholder-silver-black-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm disabled:opacity-50"
            rows="1"
            style={{ minHeight: '40px', maxHeight: '100px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim() || !!connectionError}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 text-sm"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Send</span>
          </button>
        </div>
        <div className="text-xs text-silver-black-400 mt-2 text-center">
          Backend: {API_BASE}
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
