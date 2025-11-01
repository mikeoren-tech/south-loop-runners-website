"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Heart, MessageCircle } from "lucide-react"

const instagramPosts = [
  {
    id: 1,
    image: "/group-of-runners-on-chicago-lakefront-at-sunrise.jpg",
    caption: "Beautiful sunrise run along the lakefront this morning! 🌅",
    likes: 142,
    comments: 18,
  },
  {
    id: 2,
    image: "/runners-crossing-chicago-marathon-finish-line.jpg",
    caption: "Congrats to all our members who crushed the Chicago Marathon! 🏃‍♀️💪",
    likes: 256,
    comments: 34,
  },
  {
    id: 3,
    image: "/group-photo-of-runners-in-south-loop-chicago.jpg",
    caption: "Another amazing Thursday social run! Love this community ❤️",
    likes: 189,
    comments: 22,
  },
  {
    id: 4,
    image: "/runners-on-snowy-chicago-winter-trail.jpg",
    caption: "We don't let a little snow stop us! ❄️ #ChicagoRunners",
    likes: 203,
    comments: 28,
  },
  {
    id: 5,
    image: "/post-run-coffee-and-bagels-with-runners.jpg",
    caption: "Post-run fuel is the best fuel ☕🥯",
    likes: 167,
    comments: 15,
  },
  {
    id: 6,
    image: "/runners-at-grant-park-buckingham-fountain-chicago.jpg",
    caption: "Tuesday tempo runs at Buckingham Fountain never get old 💙",
    likes: 178,
    comments: 19,
  },
]

export function InstagramFeed() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">Follow Our Journey</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Check out our latest runs, races, and community moments on Instagram
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/southlooprunners"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white flex gap-6">
                      <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 fill-white" />
                        <span className="font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 fill-white" />
                        <span className="font-semibold">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="gap-2" asChild>
            <a href="https://www.instagram.com/southlooprunners" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
              Follow @southlooprunners
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
