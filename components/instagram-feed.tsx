"use client"

import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WaveTransition } from "@/components/wave-transition"

interface InstagramPost {
  URL: string
  caption?: string
}

export function InstagramFeed() {
  const [instagramPostUrls, setInstagramPostUrls] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/instagram/active", {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setInstagramPostUrls(data)
        } else {
          // Fallback to empty array if API fails
          setInstagramPostUrls([])
        }
      } catch (error) {
        console.error("Failed to load Instagram posts:", error)
        setInstagramPostUrls([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

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
  }, [instagramPostUrls])

  if (loading) {
    return (
      <section className="relative py-20 bg-[rgba(249,250,251,0.5)]" aria-labelledby="instagram-heading">
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-muted-foreground">Loading Instagram feed...</p>
            </div>
          </div>
        </div>
        <WaveTransition fillColor="#ffffff" />
      </section>
    )
  }

  if (instagramPostUrls.length === 0) {
    return null // Don't render section if no posts
  }

  return (
    <section className="relative py-20 bg-[rgba(249,250,251,0.5)]" aria-labelledby="instagram-heading">
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
              {instagramPostUrls.map((post, index) => (
                <ScrollReveal key={post.URL} delay={index * 50}>
                  <div
                    className="glassmorphism rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift"
                    role="article"
                    aria-label={post.caption || `Instagram post ${index + 1}`}
                  >
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={post.URL}
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
