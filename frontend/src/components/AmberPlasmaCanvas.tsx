import { useEffect, useRef } from 'react'

export default function AmberPlasmaCanvas() {
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
      time += 0.008
      ctx.clearRect(0, 0, width, height)

      // Pitch Black Background
      ctx.fillStyle = '#030303'
      ctx.fillRect(0, 0, width, height)

      // Floating / Morphing Plasma Blob 1 (Lower Right Glow)
      const b1x = width * 0.55 + Math.sin(time * 1.1) * (width * 0.12)
      const b1y = height * 0.72 + Math.cos(time * 0.9) * (height * 0.1)
      const b1r = Math.min(width, height) * 0.45

      const g1 = ctx.createRadialGradient(b1x, b1y, 10, b1x, b1y, b1r)
      g1.addColorStop(0, 'rgba(235, 94, 40, 0.85)')
      g1.addColorStop(0.35, 'rgba(217, 119, 6, 0.55)')
      g1.addColorStop(0.7, 'rgba(154, 52, 18, 0.25)')
      g1.addColorStop(1, 'transparent')

      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)

      // Floating / Morphing Plasma Blob 2 (Upper Left Wave)
      const b2x = width * 0.35 + Math.cos(time * 0.8) * (width * 0.15)
      const b2y = height * 0.25 + Math.sin(time * 1.2) * (height * 0.12)
      const b2r = Math.min(width, height) * 0.5

      const g2 = ctx.createRadialGradient(b2x, b2y, 20, b2x, b2y, b2r)
      g2.addColorStop(0, 'rgba(224, 86, 36, 0.75)')
      g2.addColorStop(0.4, 'rgba(180, 83, 9, 0.45)')
      g2.addColorStop(0.8, 'rgba(124, 45, 18, 0.18)')
      g2.addColorStop(1, 'transparent')

      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)

      // Silky Smooth S-Curve Plasma Ribbons
      const waveCount = 5
      for (let w = 0; w < waveCount; w++) {
        const offset = w * 0.6
        const waveTime = time + offset

        ctx.beginPath()

        const startX = width * 0.1 + Math.sin(waveTime * 0.7) * (width * 0.15)
        const startY = -40

        const cp1x = width * 0.75 + Math.cos(waveTime * 0.9 + w) * (width * 0.25)
        const cp1y = height * 0.35 + Math.sin(waveTime * 1.1) * (height * 0.15)

        const cp2x = width * 0.15 + Math.sin(waveTime * 1.3) * (width * 0.2)
        const cp2y = height * 0.7 + Math.cos(waveTime * 0.8 + w) * (height * 0.18)

        const endX = width * 0.6 + Math.cos(waveTime * 0.6) * (width * 0.2)
        const endY = height + 40

        const strokeGrad = ctx.createLinearGradient(startX, startY, endX, endY)
        strokeGrad.addColorStop(0, 'rgba(224, 86, 36, 0.05)')
        strokeGrad.addColorStop(0.3, 'rgba(235, 94, 40, 0.65)')
        strokeGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.75)')
        strokeGrad.addColorStop(1, 'rgba(180, 83, 9, 0.1)')

        ctx.strokeStyle = strokeGrad
        ctx.lineWidth = 140 - w * 18
        ctx.lineCap = 'round'

        ctx.moveTo(startX, startY)
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
        ctx.stroke()
      }

      // High Intensity Hotspot Core (Center Glow)
      const cx = width * 0.52 + Math.sin(time * 1.3) * (width * 0.08)
      const cy = height * 0.78 + Math.cos(time * 1.1) * (height * 0.06)

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140)
      coreGrad.addColorStop(0, 'rgba(251, 146, 60, 0.95)')
      coreGrad.addColorStop(0.4, 'rgba(234, 88, 12, 0.7)')
      coreGrad.addColorStop(0.8, 'rgba(194, 65, 12, 0.25)')
      coreGrad.addColorStop(1, 'transparent')

      ctx.fillStyle = coreGrad
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateBounds)
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
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(32px) contrast(1.2)'
      }}
    />
  )
}
