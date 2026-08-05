import { useState } from 'react'
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  Code, 
  MessageSquare,
  Copy,
  Check,
  X,
  Loader2
} from 'lucide-react'

const suggestedPrompts = [
  {
    icon: Code,
    title: 'Code Review',
    prompt: 'Review my recent pull request and suggest improvements'
  },
  {
    icon: FileText,
    title: 'Generate Documentation',
    prompt: 'Generate documentation for my authentication module'
  },
  {
    icon: MessageSquare,
    title: 'Summarize Issues',
    prompt: 'Summarize the open issues in my repository'
  },
  {
    icon: Sparkles,
    title: 'Productivity Tips',
    prompt: 'Give me tips to improve my development workflow'
  }
]

const sampleConversation = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant powered by SycnOps. I can help you with code reviews, documentation generation, issue analysis, and productivity insights. How can I assist you today?'
  }
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(sampleConversation)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant', 
        content: `I understand you're asking about: "${input}". Based on your repository activity and recent commits, I can provide insights and recommendations. Let me analyze your codebase and give you a detailed response...`
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt)
  }

  const copyToClipboard = (content, messageId) => {
    navigator.clipboard.writeText(content)
    setCopiedMessage(messageId)
    setTimeout(() => setCopiedMessage(null), 2000)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-secondary-900">AI Assistant</h1>
        <p className="text-secondary-600 mt-1">Get intelligent insights and assistance for your development workflow</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-secondary-200 mt-6 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-600" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(message.content, index)}
                      className="flex items-center gap-1 text-xs text-secondary-500 hover:text-secondary-700"
                    >
                      {copiedMessage === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-secondary-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div className="bg-secondary-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-secondary-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 mb-3">Suggested prompts:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => {
                const Icon = prompt.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt.prompt)}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary-100 hover:bg-secondary-200 rounded-lg text-sm text-secondary-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {prompt.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-secondary-200 bg-secondary-50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your repositories, code, or workflow..."
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary-400">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Capabilities Info */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-secondary-900">Code Analysis</h3>
          </div>
          <p className="text-sm text-secondary-600">Review code, suggest improvements, and identify potential issues</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-secondary-900">Documentation</h3>
          </div>
          <p className="text-sm text-secondary-600">Generate comprehensive documentation from your codebase</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-secondary-900">Productivity Insights</h3>
          </div>
          <p className="text-sm text-secondary-600">Get personalized recommendations to improve your workflow</p>
        </div>
      </div>
    </div>
  )
}
