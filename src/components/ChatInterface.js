import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, AlertCircle } from 'lucide-react'

const ChatInterface = ({ chatbotType, service, chatbotConfig, connectionError }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

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
  }, [chatbotType, service])

  const getWelcomeMessage = (type) => {
    const welcomeMessages = {
      news: "Hello! I'm your News Assistant. I can help you get the latest news updates. What would you like to know about today's news?",
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

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        model: data.model
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 message-fade-in ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-green-500 to-teal-500'
            }`}>
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            
            <div className={`max-w-[70%] rounded-2xl p-3 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-silver-black-700 text-silver-black-100'
            } ${message.error ? 'border border-red-400' : ''}`}>
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              {message.model && (
                <div className="text-xs opacity-70 mt-1">
                  Model: {message.model}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-silver-black-700 rounded-2xl p-3 flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-silver-black-700 flex-shrink-0">
        {connectionError && (
          <div className="mb-3 bg-red-500/20 border border-red-500/30 rounded-lg p-2 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{connectionError}</span>
          </div>
        )}
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
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface