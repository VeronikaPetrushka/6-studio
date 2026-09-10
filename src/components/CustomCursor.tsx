import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const interactiveSelector = [
  'a',
  'button',
  '[role="button"]',
  '.product-card',
  '.product-media',
  '.category-plane',
  '.collection-card',
  '.lookbook-grid figure',
  '.kinetic-pile',
  '.related-card',
].join(',')

const textSelector = 'input, textarea, select, [contenteditable="true"]'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reducedMotion.matches) return

    document.body.classList.add('custom-cursor-enabled')

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      autoAlpha: 0,
      scale: 1,
    })

    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' })

    let visible = false
    let active = false
    let textMode = false

    const setVisualState = () => {
      cursor.classList.toggle('is-active', active)
      cursor.classList.toggle('is-text', textMode)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      moveX(event.clientX)
      moveY(event.clientY)
      if (!visible) {
        visible = true
        gsap.to(cursor, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' })
      }
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (!target) return
      textMode = Boolean(target.closest(textSelector))
      active = !textMode && Boolean(target.closest(interactiveSelector))
      setVisualState()
    }

    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget instanceof Element ? event.relatedTarget : null
      if (!next) {
        active = false
        textMode = false
      } else {
        textMode = Boolean(next.closest(textSelector))
        active = !textMode && Boolean(next.closest(interactiveSelector))
      }
      setVisualState()
    }

    const onDown = () => {
      cursor.classList.add('is-pressed')
      gsap.to(cursor, { scale: 0.78, duration: 0.13, ease: 'power2.out' })
    }

    const onUp = () => {
      cursor.classList.remove('is-pressed')
      gsap.to(cursor, { scale: 1, duration: 0.34, ease: 'back.out(2.2)' })
    }

    const onLeave = () => {
      visible = false
      active = false
      textMode = false
      setVisualState()
      gsap.to(cursor, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' })
    }

    const onEnter = () => {
      if (visible) gsap.to(cursor, { autoAlpha: 1, duration: 0.18 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      gsap.killTweensOf(cursor)
    }
  }, [])

  return <div ref={cursorRef} className="studio-cursor" aria-hidden="true"><span /></div>
}
