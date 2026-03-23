"use client"

import type React from "react"
import { useState } from "react"
import { Bell, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function NotificationSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribe-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        setTimeout(() => setSubscribed(false), 6000)
      } else {
        setError(data.error || "Failed to subscribe. Please try again.")
      }
    } catch {
      setError("Failed to subscribe. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto glass-strong shadow-soft-lg border-0">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Bell className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-balance">Get Run & Race Notifications</h2>
                <p className="text-muted-foreground text-balance">
                  Enter your email and we'll let you know when new runs or races are added to the schedule.
                </p>
              </div>

              {subscribed ? (
                <div
                  className="flex items-center gap-2 text-green-600 font-medium pt-2"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  You're signed up! We'll be in touch.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2"
                  aria-label="Notification signup form"
                >
                  <label htmlFor="notification-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="notification-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                    aria-required="true"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="gap-2 shrink-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Signing up...
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </Button>
                </form>
              )}

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
