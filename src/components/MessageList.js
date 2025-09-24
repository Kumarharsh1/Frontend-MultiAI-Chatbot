import { Bot, User, Loader } from 'lucide-react'

const MessageList = ({ messages, isLoading }) => {
  return (
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
  )
}

export default MessageList
