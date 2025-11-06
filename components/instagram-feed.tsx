"use client"

import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { useEffect } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WaveTransition } from "@/components/wave-transition"

const instagramPostUrls = [
  "https://www.instagram.com/p/DP9K4vRjQFC/", // Replace with actual post URL
  "https://www.instagram.com/p/DNlckmkRoOp", // Replace with actual post URL
  "https://www.instagram.com/p/DIpBIqBvI3K", // Replace with actual post URL
  "https://www.instagram.com/p/DQX-bcQDSop/", // Replace with actual post URL
  "https://www.instagram.com/reel/C_A2lrwxRLx/", // Replace with actual post URL
  "https://www.instagram.com/p/DPy33Mvju6e/", // Replace with actual post URL
]

export function InstagramFeed() {
  useEffect(() => {
    // Load Instagram's embed script
    const script = document.createElement("script")
    script.src = "https://www.instagram.com/embed.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className="relative py-20 bg-[rgba(249,250,251,0.5)]">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <div className="mb-4">
            <h2 className="text-4xl md:text-5xl font-bold">Follow Our Journey</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Check out our latest runs, races, and community moments on Instagram
          </p>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramPostUrls.map((url, index) => (
              <ScrollReveal key={url} delay={index * 50}>
                <div className="glassmorphism rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{
                      background: "transparent",
                      border: "0",
                      borderRadius: "12px",
                      margin: "0",
                      padding: "0",
                      width: "100%",
                      minWidth: "326px",
                    }}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal className="text-center" delay={300}>
          <Button size="lg" className="gap-2" asChild>
            <a href="https://www.instagram.com/southlooprunners" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
              Follow @southlooprunners
            </a>
          </Button>
        </ScrollReveal>
      </div>
      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
