"use client"

import type React from "react"

import { useState } from "react"
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  hasBack?: boolean
}

export function FlipCard({ front, back, hasBack = true }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!hasBack) {
    return <div className="flip-card-inner">{front}</div>
  }

  return (
    <div className="relative h-full" style={{ perspective: "1000px" }}>
      <div
        className={`flip-card-inner transition-all duration-500 ease-in-out ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Front */}
        <div
          className="flip-card-face"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: isFlipped ? "absolute" : "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {front}
          {hasBack && (
            <Button
              onClick={() => setIsFlipped(true)}
              size="sm"
              variant="secondary"
              className="absolute bottom-4 right-4 shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              View Route Map
            </Button>
          )}
        </div>

        {/* Back */}
        <div
          className="flip-card-face"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: !isFlipped ? "absolute" : "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="relative h-full">
            {back}
            <Button
              onClick={() => setIsFlipped(false)}
              size="sm"
              variant="secondary"
              className="absolute bottom-4 right-4 shadow-lg hover:shadow-xl transition-all z-10"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
