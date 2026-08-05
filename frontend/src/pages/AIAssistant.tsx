import { useState } from 'react'
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react'
import { useAiAssistantMutation } from '@/hooks/useApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

export default function AIAssistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your SycnOps AI assistant. How can I help optimize your development workflow today?',
      timestamp: '10:00 AM'
    }
  ])

  const aiMutation = useAiAssistantMutation()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || aiMutation.isPending) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    const promptText = input
    setInput('')

    try {
      const responseText = await aiMutation.mutateAsync(promptText)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the SycnOps backend service.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">AI Assistant</h1>
        <p className="text-secondary-600 mt-1">Chat with AI for workflow automation, PR summaries, and code optimization</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b flex flex-row items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-lg">SycnOps Copilot</CardTitle>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Online & Connected to TanStack React Query
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  msg.sender === 'user' ? 'bg-secondary-900 text-white' : 'bg-primary-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-secondary-100 text-secondary-900 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`block text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-primary-100' : 'text-secondary-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {aiMutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-secondary-500 italic">
              <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
              SycnOps AI is thinking...
            </div>
          )}
        </CardContent>

        <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3">
          <Input
            placeholder="Ask AI to summarize PRs, review code, or generate docs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiMutation.isPending}
          />
          <Button type="submit" disabled={aiMutation.isPending}>
            {aiMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </Card>
    </div>
  )
}
