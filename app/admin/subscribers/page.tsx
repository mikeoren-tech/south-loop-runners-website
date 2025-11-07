"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Plus, Loader2, Users, CheckCircle2 } from "lucide-react"
import type { EmailSubscriber } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SubscribersAdminPage() {
  const { data: subscribers = [], mutate, isLoading } = useSWR<EmailSubscriber[]>("/api/subscribers", fetcher)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add subscriber")
      }

      await mutate()
      setEmail("")
      setIsAddDialogOpen(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("[v0] Error adding subscriber:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeSubscribers = subscribers.filter((s) => s.is_active === 1)
  const inactiveSubscribers = subscribers.filter((s) => s.is_active === 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Email Subscribers</h1>
          <p className="text-muted-foreground">Manage subscribers who receive automated event notifications</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Subscriber
        </Button>
      </div>

      {success && (
        <Card className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="flex items-center gap-2 py-4">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-medium">Subscriber added successfully!</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers.length}</div>
            <p className="text-xs text-muted-foreground">Receiving notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveSubscribers.length}</div>
            <p className="text-xs text-muted-foreground">Opted out</p>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && subscribers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No subscribers yet</h3>
            <p className="text-muted-foreground mb-4">Add your first subscriber to start sending event notifications</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscriber
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && subscribers.length > 0 && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Active Subscribers ({activeSubscribers.length})</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {activeSubscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Subscribed {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {inactiveSubscribers.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Unsubscribed ({inactiveSubscribers.length})</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {inactiveSubscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">{subscriber.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Unsubscribed{" "}
                              {subscriber.unsubscribed_at
                                ? new Date(subscriber.unsubscribed_at).toLocaleDateString()
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Inactive</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email Subscriber</DialogTitle>
            <DialogDescription>
              Add a new subscriber to receive automated event notifications via email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubscriber} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="subscriber@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subscriber
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setEmail("")
                  setError(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
