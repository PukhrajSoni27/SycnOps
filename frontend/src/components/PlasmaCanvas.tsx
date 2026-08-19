import { useEffect, useRef } from 'react'

interface PlasmaCanvasProps {
  color1?: string // e.g. "rgba(16, 185, 129, "
  color2?: string // e.g. "rgba(6, 182, 212, "
  speed?: number
  scale?: number
}

export default function PlasmaCanvas({
  color1 = 'rgba(16, 185, 129, ',
  color2 = 'rgba(6, 182, 212, ',
  speed = 1.0
}: PlasmaCanvasProps) {
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

    let time = 0

    const animate = () => {
      time += 0.018 * speed
      ctx.clearRect(0, 0, width, height)

      // 1. Multi-layered Ambient Plasma Orbs / Glowing Radial Gradients
      const cx1 = width * 0.5 + Math.sin(time * 0.7) * (width * 0.25)
      const cy1 = height * 0.4 + Math.cos(time * 0.8) * (height * 0.25)

      const grad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, Math.max(width, height) * 0.6)
      grad1.addColorStop(0, `${color1}0.45)`)
      grad1.addColorStop(0.5, `${color2}0.22)`)
      grad1.addColorStop(1, 'transparent')

      ctx.fillStyle = grad1
      ctx.fillRect(0, 0, width, height)

      const cx2 = width * 0.5 + Math.cos(time * 0.9) * (width * 0.3)
      const cy2 = height * 0.6 + Math.sin(time * 0.6) * (height * 0.3)

      const grad2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, Math.max(width, height) * 0.5)
      grad2.addColorStop(0, `${color2}0.38)`)
      grad2.addColorStop(0.6, `${color1}0.15)`)
      grad2.addColorStop(1, 'transparent')

      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, width, height)

      // 2. Electric Plasma Tendrils
      const tendrils = 6
      for (let t = 0; t < tendrils; t++) {
        ctx.beginPath()
        ctx.strokeStyle = t % 2 === 0 ? `${color1}0.65)` : `${color2}0.65)`
        ctx.lineWidth = t % 2 === 0 ? 2.5 : 1.5

        const startX = (width * 0.2) + (t * (width * 0.12)) + Math.sin(time + t * 1.2) * 35
        const startY = -20

        ctx.moveTo(startX, startY)

        const steps = 24
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps
          const n1 = Math.sin(time * 2.0 + i * 0.6 + t * 1.4) * (45 + t * 5)
          const n2 = Math.cos(time * 1.5 + i * 0.5) * 30

          const currentX = startX + n1 + Math.sin(i * 2.2 + time * 1.8) * 15
          const currentY = startY + progress * (height + 40) + n2

          ctx.lineTo(currentX, currentY)
        }
        ctx.stroke()
      }

      // 3. Floating Bioluminescent Sparks / Plasma Motes
      const sparkCount = 28
      for (let p = 0; p < sparkCount; p++) {
        const px = (Math.sin(p * 9 + time * 1.2) * 0.45 + 0.5) * width
        const py = (Math.cos(p * 7 + time * 0.85) * 0.45 + 0.5) * height
        const radius = Math.max(0.8, Math.sin(time * 2.2 + p) * 1.8 + 2.2)

        ctx.beginPath()
        ctx.fillStyle = p % 2 === 0 ? `${color1}0.85)` : `${color2}0.85)`
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateBounds)
      cancelAnimationFrame(animationFrameId)
    }
  }, [color1, color2, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}
