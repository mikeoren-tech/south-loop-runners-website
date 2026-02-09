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
          className="flip-card-face flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: isFlipped ? "absolute" : "relative",
            width: "100%",
            height: "100%",
            pointerEvents: isFlipped ? "none" : "auto",
          }}
        >
          <div className="flex-1 min-h-0">{front}</div>
          {hasBack && (
            <div className="sticky bottom-0 z-10 rounded-b-3xl bg-gradient-to-t from-card via-card/95 to-transparent px-4 pb-3 pt-8 flex justify-end">
              <Button
                onClick={() => setIsFlipped(true)}
                size="sm"
                variant="secondary"
                className="shadow-lg hover:shadow-xl transition-all"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                View Route Map
              </Button>
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="flip-card-face flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: !isFlipped ? "absolute" : "relative",
            width: "100%",
            height: "100%",
            pointerEvents: !isFlipped ? "none" : "auto",
          }}
        >
          <div className="flex-1 min-h-0">{back}</div>
          <div className="sticky bottom-0 z-10 rounded-b-3xl bg-gradient-to-t from-card via-card/95 to-transparent px-4 pb-3 pt-8 flex justify-end">
            <Button
              onClick={() => setIsFlipped(false)}
              size="sm"
              variant="secondary"
              className="shadow-lg hover:shadow-xl transition-all"
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
