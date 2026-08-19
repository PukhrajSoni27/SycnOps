import { useState } from 'react'
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react'
import { useAiAssistantMutation } from '@/hooks/useApi'

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
      text: 'Hello! I am your SycnOps AI assistant. How can I help optimize your engineering workflow, summarize PRs, or review code today?',
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
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
          AUTONOMOUS COPILOT
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
          AI Assistant
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Chat with AI for workflow automation, PR summaries, code reviews, and architecture optimization.
        </p>
      </div>

      {/* Main Chat Container */}
      <div
        className="s-spotlight"
        style={{
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Chat Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: 'var(--text)' }}>
              SycnOps Copilot
            </h2>
            <p style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', letterSpacing: '0.1em' }}>
              <Sparkles className="w-3 h-3 text-emerald-400" /> ONLINE &amp; ACTIVE
            </p>
          </div>
        </div>

        {/* Message Log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.2)',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#10B981',
                  border: msg.sender === 'user' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(16,185,129,0.3)',
                  flexShrink: 0
                }}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                style={{
                  maxWidth: '75%',
                  borderRadius: '18px',
                  padding: '14px 18px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                  backgroundColor: msg.sender === 'user' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text)',
                  border: msg.sender === 'user' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}
              >
                <p style={{ margin: 0 }}>{msg.text}</p>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-tech)', color: 'var(--text-dim)', textAlign: 'right', marginTop: '6px' }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {aiMutation.isPending && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-tech)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              SycnOps AI is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <input
            type="text"
            placeholder="Ask AI to summarize PRs, review code, or generate docs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiMutation.isPending}
            style={{
              flex: 1,
              padding: '12px 18px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--emerald)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            disabled={aiMutation.isPending}
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--emerald)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {aiMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
