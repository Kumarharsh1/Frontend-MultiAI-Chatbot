import { useState } from 'react'

const ChatSelector = ({ activeChatbot, setActiveChatbot, configs }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-silver-black-800/50 backdrop-blur-lg rounded-2xl p-6 border border-silver-black-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Chatbots</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-silver-black-400 hover:text-white transition-colors"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="space-y-3">
          {Object.entries(configs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveChatbot(key)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                activeChatbot === key
                  ? `bg-gradient-to-r ${config.color} text-white transform scale-105 shadow-lg`
                  : 'bg-silver-black-700/50 hover:bg-silver-black-700 text-silver-black-200 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm opacity-80">{config.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatSelector