import { Bot, User, Loader, AlertCircle } from 'lucide-react'

const MessageList = ({ messages, isLoading }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 animate-fade-in ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar */}
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
          
          {/* Message Bubble */}
          <div className={`max-w-[70%] rounded-2xl p-4 relative ${
            message.role === 'user'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'bg-silver-black-700 text-silver-black-100 border border-silver-black-600'
          } ${message.error ? 'border-2 border-red-400' : ''}`}>
            
            {/* Message Content */}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            
            {/* Message Metadata */}
            <div className={`flex items-center justify-between mt-2 text-xs ${
              message.role === 'user' ? 'text-blue-100' : 'text-silver-black-400'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {message.model && (
                <span className="bg-black/20 px-2 py-1 rounded-full">
                  {message.model}
                </span>
              )}
            </div>
            
            {/* Error Indicator */}
            {message.error && (
              <div className="absolute -top-2 -left-2 bg-red-500 rounded-full p-1">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-start space-x-3 animate-pulse">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="bg-silver-black-700 rounded-2xl p-4 flex items-center space-x-3">
            <Loader className="h-4 w-4 animate-spin text-green-400" />
            <div className="space-y-2">
              <div className="h-2 w-20 bg-silver-black-600 rounded"></div>
              <div className="h-2 w-16 bg-silver-black-600 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
