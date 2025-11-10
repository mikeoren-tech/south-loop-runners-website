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

    script.onload = () => {
      // Process Instagram embeds after script loads
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }

    document.body.appendChild(script)

    // If script was already loaded, process embeds immediately
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    }

    return () => {
      try {
        document.body.removeChild(script)
      } catch (e) {
        // Script may have already been removed
      }
    }
  }, [])

  return (
    <section className="relative py-20 bg-white" aria-labelledby="instagram-heading">
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-12">
            <div className="mb-4">
              <h2 id="instagram-heading" className="text-4xl md:text-5xl font-bold">
                Follow Our Journey
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Check out our latest runs, races, and community moments on Instagram
            </p>
          </ScrollReveal>

          <div className="max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instagramPostUrls.map((url, index) => (
                <ScrollReveal key={url} delay={index * 50}>
                  <div
                    className="glassmorphism rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift"
                    role="article"
                    aria-label={`Instagram post ${index + 1}`}
                  >
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={url}
                      data-instgrm-version="14"
                      style={{
                        background: "transparent",
                        border: "0",
                        borderRadius: "24px",
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
            <Button
              size="lg"
              className="relative z-30 gap-2 backdrop-blur-md bg-primary/80 hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              asChild
            >
              <a href="https://www.instagram.com/southlooprunners" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" aria-hidden="true" />
                Follow @southlooprunners
                <span className="sr-only">Opens in new window</span>
              </a>
            </Button>
          </ScrollReveal>
        </div>
      </div>
      <WaveTransition fillColor="#ffffff" />
    </section>
  )
}
