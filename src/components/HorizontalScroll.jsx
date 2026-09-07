import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../icons'
import './HorizontalScroll.css'

function getScrollState(el) {
  if (!el) return { canScrollLeft: false, canScrollRight: false }
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 2) {
    return { canScrollLeft: false, canScrollRight: false }
  }

  const isRtl = getComputedStyle(el).direction === 'rtl'
  const sl = el.scrollLeft

  if (!isRtl) {
    return {
      canScrollLeft: sl > 4,
      canScrollRight: sl < maxScroll - 4,
    }
  }

  if (sl <= 0) {
    // Standard modern negative RTL (0 at right edge, -maxScroll at left edge)
    const current = Math.abs(sl)
    return {
      canScrollRight: current > 4,
      canScrollLeft: current < maxScroll - 4,
    }
  } else {
    // Alternate positive RTL (maxScroll at right edge, 0 at left edge)
    return {
      canScrollLeft: sl > 4,
      canScrollRight: sl < maxScroll - 4,
    }
  }
}

export default function HorizontalScroll({
  children,
  className = '',
  trackClassName = '',
  trackRef: externalRef,
  showChevrons = true,
  step = 200,
  dragSensitivity = 1,
  ariaLabel = 'محتوای افقی',
  ...props
}) {
  const innerRef = useRef(null)
  const trackRef = externalRef || innerRef

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { canScrollLeft: left, canScrollRight: right } = getScrollState(el)
    setCanScrollLeft(left)
    setCanScrollRight(right)
  }, [trackRef])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })

    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [trackRef, updateScrollState])

  const scrollLeft = () => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: -step, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: step, behavior: 'smooth' })
  }

  // Mouse Drag-to-Scroll handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return // Only primary left click
    // Skip interactive input/textarea elements
    const tag = e.target.tagName.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return

    const el = trackRef.current
    if (!el) return

    isDownRef.current = true
    hasDraggedRef.current = false
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return
    const el = trackRef.current
    if (!el) return

    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * dragSensitivity

    if (Math.abs(walk) > 5) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true
        setIsDragging(true)
      }
      e.preventDefault()
      el.scrollLeft = scrollLeftRef.current - walk
    }
  }

  const endDrag = () => {
    if (!isDownRef.current) return
    isDownRef.current = false
    // Delay clearing isDragging slightly so click capture handler sees it
    setTimeout(() => {
      setIsDragging(false)
      hasDraggedRef.current = false
    }, 50)
  }

  const handleCaptureClick = (e) => {
    if (hasDraggedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Wheel to horizontal scroll
  const handleWheel = (e) => {
    const el = trackRef.current
    if (!el) return
    if (e.shiftKey) return // native horizontal scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // trackpad already scrolling horizontally
    if (el.scrollWidth <= el.clientWidth) return

    e.preventDefault()
    el.scrollLeft += e.deltaY
  }

  return (
    <div
      className={`hz-scroll-container ${isDragging ? 'is-dragging' : ''} ${className}`}
      {...props}
    >
      {showChevrons && (
        <>
          <button
            type="button"
            className={`hz-scroll-chevron hz-chevron-left ${canScrollLeft ? 'visible' : ''}`}
            onClick={scrollLeft}
            tabIndex={-1}
            aria-label="اسکرول به چپ"
          >
            <IconChevronLeft size={16} />
          </button>
          <div className={`hz-scroll-fade hz-fade-left ${canScrollLeft ? 'visible' : ''}`} />

          <button
            type="button"
            className={`hz-scroll-chevron hz-chevron-right ${canScrollRight ? 'visible' : ''}`}
            onClick={scrollRight}
            tabIndex={-1}
            aria-label="اسکرول به راست"
          >
            <IconChevronRight size={16} />
          </button>
          <div className={`hz-scroll-fade hz-fade-right ${canScrollRight ? 'visible' : ''}`} />
        </>
      )}

      <div
        ref={trackRef}
        className={`hz-scroll-track ${trackClassName}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={handleCaptureClick}
        onWheel={handleWheel}
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  )
}
