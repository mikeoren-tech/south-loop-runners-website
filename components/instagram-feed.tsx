"use client"

import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { useEffect } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"

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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">Follow Our Journey</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Check out our latest runs, races, and community moments on Instagram
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {instagramPostUrls.map((url, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: "0",
                    borderRadius: "3px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "1px",
                    maxWidth: "540px",
                    minWidth: "326px",
                    padding: "0",
                    width: "calc(100% - 2px)",
                  }}
                />
              </div>
            </ScrollReveal>
          ))}
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
    </section>
  )
}
