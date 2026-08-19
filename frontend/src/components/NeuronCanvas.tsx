import { useEffect, useRef } from 'react'

export default function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0

    const updateBounds = () => {
      if (!canvas || !canvas.parentElement) return
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    updateBounds()
    window.addEventListener('resize', updateBounds)

    // Neuron Node structure
    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      pulsePhase: number
    }

    // Signal Pulse structure traveling along connections
    interface Pulse {
      fromIndex: number
      toIndex: number
      progress: number
      speed: number
      color: string
    }

    const count = 40
    const nodes: Node[] = []
    const colors = ['rgba(16, 185, 129, ', 'rgba(6, 182, 212, ', 'rgba(52, 211, 153, ']

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * (width || 400),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2
      })
    }

    const pulses: Pulse[] = []

    // Spawn pulses periodically
    const spawnPulse = () => {
      if (nodes.length < 2) return
      const fromIndex = Math.floor(Math.random() * nodes.length)
      let closestIndex = -1
      let minDistance = 140

      for (let j = 0; j < nodes.length; j++) {
        if (fromIndex === j) continue
        const dx = nodes[fromIndex].x - nodes[j].x
        const dy = nodes[fromIndex].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDistance) {
          minDistance = dist
          closestIndex = j
        }
      }

      if (closestIndex !== -1 && pulses.length < 12) {
        pulses.push({
          fromIndex,
          toIndex: closestIndex,
          progress: 0,
          speed: 0.015 + Math.random() * 0.02,
          color: nodes[fromIndex].color
        })
      }
    }

    const pulseInterval = setInterval(spawnPulse, 400)

    let time = 0

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // 1. Update node positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      }

      // 2. Draw connections (Synapses)
      const maxDistance = 135
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22
            ctx.beginPath()
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
            ctx.lineWidth = 1
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].y, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // 3. Update & Draw Pulses (Action Potentials)
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p]
        pulse.progress += pulse.speed

        if (pulse.progress >= 1) {
          pulses.splice(p, 1)
          continue
        }

        const n1 = nodes[pulse.fromIndex]
        const n2 = nodes[pulse.toIndex]
        if (!n1 || !n2) continue

        const px = n1.x + (n2.x - n1.x) * pulse.progress
        const py = n1.y + (n2.y - n1.y) * pulse.progress

        ctx.beginPath()
        ctx.fillStyle = `${pulse.color}0.95)`
        ctx.shadowColor = '#10B981'
        ctx.shadowBlur = 8
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 4. Draw Neuron Nodes (Somas)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const pulseRadius = node.radius + Math.sin(time * 2 + node.pulsePhase) * 0.6

        // Outer glow
        ctx.beginPath()
        ctx.fillStyle = `${node.color}0.25)`
        ctx.arc(node.x, node.y, pulseRadius * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.fillStyle = `${node.color}0.9)`
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateBounds)
      clearInterval(pulseInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65
      }}
    />
  )
}
