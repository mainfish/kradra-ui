import { useEffect, useRef } from 'react'

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function createStars(width, height, count) {
  const colorPalette = [
    [255, 255, 255],
    [255, 244, 214],
    [255, 233, 186],
    [214, 227, 255],
    [196, 214, 255],
    [255, 214, 170],
  ]

  return Array.from({ length: count }, () => {
    const [r, g, b] = randomFrom(colorPalette)
    const sizeBand = Math.random()

    let radius
    if (sizeBand < 0.72) {
      radius = 0.45 + Math.random() * 0.9
    } else if (sizeBand < 0.95) {
      radius = 1.1 + Math.random() * 1.4
    } else {
      radius = 2.8 + Math.random() * 2.6
    }

    return {
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      radius,
      alpha: 0.2 + Math.random() * 0.65,
      color: { r, g, b },
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      driftX: 6 + Math.random() * 18,
      driftY: 4 + Math.random() * 14,
      driftSpeedX: 0.00008 + Math.random() * 0.00018,
      driftSpeedY: 0.00006 + Math.random() * 0.00015,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.0008 + Math.random() * 0.0018,
      glowMultiplier: radius > 2.5 ? 7.5 : radius > 1.4 ? 5.5 : 3.8,
    }
  })
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, '#03050a')
  bg.addColorStop(0.45, '#080b12')
  bg.addColorStop(1, '#111722')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  const glows = [
    {
      x: width * 0.18,
      y: height * 0.24,
      r: Math.min(width, height) * 0.28,
      c: 'rgba(70, 100, 200, 0.06)',
    },
    {
      x: width * 0.78,
      y: height * 0.18,
      r: Math.min(width, height) * 0.24,
      c: 'rgba(65, 145, 170, 0.045)',
    },
    {
      x: width * 0.26,
      y: height * 0.8,
      r: Math.min(width, height) * 0.22,
      c: 'rgba(80, 90, 180, 0.035)',
    },
  ]

  for (const glow of glows) {
    const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r)
    gradient.addColorStop(0, glow.c)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(glow.x, glow.y, glow.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawStar(ctx, star, time) {
  const x = star.baseX + Math.sin(time * star.driftSpeedX + star.phaseX) * star.driftX
  const y = star.baseY + Math.cos(time * star.driftSpeedY + star.phaseY) * star.driftY
  const twinkle = 0.78 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.22
  const alpha = star.alpha * twinkle
  const { r, g, b } = star.color

  const glowRadius = star.radius * star.glowMultiplier
  const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
  glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`)
  glow.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`)
  glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
  ctx.arc(x, y, star.radius, 0, Math.PI * 2)
  ctx.fill()

  if (star.radius > 2.7) {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.22})`
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(x - star.radius * 2.4, y)
    ctx.lineTo(x + star.radius * 2.4, y)
    ctx.moveTo(x, y - star.radius * 2.4)
    ctx.lineTo(x, y + star.radius * 2.4)
    ctx.stroke()
  }
}

function drawStars(ctx, stars, time) {
  for (const star of stars) {
    drawStar(ctx, star, time)
  }
}

function drawVignette(ctx, width, height) {
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.22,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.86
  )
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, 'rgba(0,0,0,0.34)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

export default function StarfieldBackground() {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const starsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(180, Math.floor((width * height) / 7000))
      starsRef.current = createStars(width, height, count)
    }

    function render(time) {
      const width = window.innerWidth
      const height = window.innerHeight

      drawBackground(ctx, width, height)
      drawStars(ctx, starsRef.current, time)
      drawVignette(ctx, width, height)

      frameRef.current = requestAnimationFrame(render)
    }

    resize()
    frameRef.current = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
