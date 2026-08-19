import { useState, useEffect } from 'react'
import { Bell, GitPullRequest, AlertCircle, CheckCircle2, Check, Send, ShieldCheck } from 'lucide-react'
import { requestNotificationPermission, onForegroundNotification } from '../lib/firebase'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'pr' | 'issue' | 'system'
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New PR Review Assigned', description: 'Alex assigned you to review PR #101 on main branch', time: '10 min ago', read: false, type: 'pr' },
    { id: '2', title: 'High Priority Issue Opened', description: 'Issue #201: OAuth token refresh failing in production cluster', time: '1 hour ago', read: false, type: 'issue' },
    { id: '3', title: 'AI Automation Completed', description: 'Weekly telemetry & documentation summary successfully generated', time: '2 hours ago', read: true, type: 'system' }
  ])
  const [permissionState, setPermissionState] = useState<string>('Notification' in window ? Notification.permission : 'unsupported')
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    // Listen for foreground Firebase FCM messages
    onForegroundNotification((payload) => {
      if (payload?.notification) {
        const newNotif: NotificationItem = {
          id: Date.now().toString(),
          title: payload.notification.title || 'Firebase FCM Event',
          description: payload.notification.body || 'New live telemetry event received.',
          time: 'Just now',
          read: false,
          type: 'system'
        }
        setNotifications(prev => [newNotif, ...prev])
      }
    })
  }, [])

  const handleEnableNotifications = async () => {
    setStatusMsg('Requesting Firebase FCM permission...')
    const result = await requestNotificationPermission()
    setStatusMsg(result.message)
    if ('Notification' in window) {
      setPermissionState(Notification.permission)
    }
    setTimeout(() => setStatusMsg(''), 4000)
  }

  const handleSendTestNotification = () => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title: '⚡ SycnOps Firebase Test Notification',
      description: 'Firebase Cloud Messaging integration test completed successfully on MongoDB Atlas backplane.',
      time: 'Just now',
      read: false,
      type: 'system'
    }
    setNotifications(prev => [newNotif, ...prev])

    // Trigger native browser notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⚡ SycnOps Notification', {
        body: 'Firebase Cloud Messaging test event received!',
        icon: '/favicon.ico'
      })
    }
    setStatusMsg('Test push notification emitted!')
    setTimeout(() => setStatusMsg(''), 3000)
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--emerald)' }}>
            FIREBASE EVENT STREAM
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text)', marginTop: '4px' }}>
            Notifications
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Stay updated with continuous repository events, PR reviews, and AI workflow alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleEnableNotifications}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: permissionState === 'granted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
              border: permissionState === 'granted' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '999px',
              color: permissionState === 'granted' ? '#10B981' : '#38BDF8',
              fontFamily: 'var(--font-tech)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {permissionState === 'granted' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            {permissionState === 'granted' ? 'Push Notifications Active' : 'Enable Firebase Notifications'}
          </button>

          <button
            onClick={handleSendTestNotification}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              color: 'var(--text)',
              fontFamily: 'var(--font-tech)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" /> Send Test Notification
          </button>

          <button
            onClick={markAllRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              color: 'var(--emerald)',
              fontFamily: 'var(--font-tech)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981',
          padding: '10px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontFamily: 'var(--font-tech)',
          fontSize: '11px'
        }}>
          {statusMsg}
        </div>
      )}

      {/* Notifications List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {notifications.map(item => (
          <div
            key={item.id}
            className="s-spotlight"
            style={{
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(12px)',
              border: item.read ? '1px solid var(--border)' : '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '20px',
              opacity: item.read ? 0.75 : 1,
              transition: 'all 0.3s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor:
                    item.type === 'pr'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : item.type === 'issue'
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'rgba(56, 189, 248, 0.1)',
                  border:
                    item.type === 'pr'
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : item.type === 'issue'
                      ? '1px solid rgba(245, 158, 11, 0.25)'
                      : '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color:
                    item.type === 'pr'
                      ? '#10B981'
                      : item.type === 'issue'
                      ? '#F59E0B'
                      : '#38BDF8',
                  flexShrink: 0
                }}
              >
                {item.type === 'pr' ? (
                  <GitPullRequest className="w-5 h-5" />
                ) : item.type === 'issue' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  {item.description}
                </p>
                <span style={{ display: 'block', fontFamily: 'var(--font-tech)', fontSize: '10px', color: 'var(--text-dim)', marginTop: '8px' }}>
                  {item.time}
                </span>
              </div>
            </div>

            {!item.read && (
              <span
                style={{
                  fontFamily: 'var(--font-tech)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                NEW
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
