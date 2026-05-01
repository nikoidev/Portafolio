"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectImage } from "@/lib/data"

interface ImageGalleryModalProps {
  images: ProjectImage[]
  projectTitle: string
  isOpen: boolean
  onClose: () => void
}

export function ImageGalleryModal({
  images,
  projectTitle,
  isOpen,
  onClose,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    document.addEventListener("keydown", handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              id="gallery-title"
              className="text-lg font-medium text-foreground"
            >
              {projectTitle}
            </h2>
            {hasMultipleImages && (
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} de {images.length}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 min-h-0">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-border">
            <Image
              src={currentImage.url}
              alt={currentImage.description}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg hover:scale-105 transition-transform"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg hover:scale-105 transition-transform"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Description */}
        <div className="mt-4 p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentImage.description}
          </p>
        </div>

        {/* Dots Indicator */}
        {hasMultipleImages && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
