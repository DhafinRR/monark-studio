"use client"

import { useLayoutEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"

// Manual type definition since @types/rough-notation is missing
interface RoughAnnotation {
  show(): void
  hide(): void
  remove(): void
}

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  useLayoutEffect(() => {
    const element = elementRef.current
    let annotation: RoughAnnotation | null = null
    let resizeObserver: ResizeObserver | null = null
    let mutationObserver: MutationObserver | null = null
    let timeoutId: NodeJS.Timeout

    const initAnnotation = () => {
      if (!element || annotation) return

      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      }

      const currentAnnotation = annotate(element, annotationConfig)
      annotation = currentAnnotation
      currentAnnotation.show()

      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (annotation) {
            annotation.hide()
            annotation.show()
          }
        })
        resizeObserver.observe(element)
        resizeObserver.observe(document.body)
      }
    }

    const checkAndInit = () => {
      if (!element) return
      
      // Get computed opacity of self or closest motion parent
      const parent = element.closest('.motion-div, [style*="opacity"]') || element
      const opacity = window.getComputedStyle(parent).opacity

      // Only init if visible (not in the middle of fade-in animation)
      if (opacity === "1" || !parent.hasAttribute('style')) {
        initAnnotation()
      }
    }

    if (shouldShow && element) {
      // Monitor for opacity changes (framer motion animations)
      mutationObserver = new MutationObserver(checkAndInit)
      mutationObserver.observe(element.parentElement || element, {
        attributes: true,
        attributeFilter: ['style', 'class']
      })

      // Initial check with extra delay for safety
      timeoutId = setTimeout(checkAndInit, 800)
      
      window.addEventListener("load", checkAndInit)
      window.addEventListener("resize", checkAndInit)
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("load", checkAndInit)
      window.removeEventListener("resize", checkAndInit)
      mutationObserver?.disconnect()
      annotation?.remove()
      resizeObserver?.disconnect()
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  return (
    <span ref={elementRef} className="relative inline bg-transparent font-inherit">
      {children}
    </span>
  )
}
