"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calendar, LogOut, Loader2, AlertCircle, Star, Instagram } from "lucide-react"
import { EventForm } from "@/components/admin/event-form"
import { EventList } from "@/components/admin/event-list"
import Link from "next/link"

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authError, setAuthError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/check", {
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        setAuthError(true)
        setTimeout(() => router.push("/admin/login"), 1000)
        return
      }

      const data = await response.json()
      if (!data.authenticated) {
        setAuthError(true)
        setTimeout(() => router.push("/admin/login"), 1000)
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Auth check failed:", error)
      setAuthError(true)
      setTimeout(() => router.push("/admin/login"), 1000)
    } finally {
      setCheckingAuth(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
    }
  }, [isAuthenticated])

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events/all", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEvent(null)
    loadEvents()
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (authError || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You must be logged in to access this page. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Event Admin</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Homepage Featured Events</CardTitle>
                  <CardDescription className="text-amber-900/70">
                    Configure which events appear prominently on the homepage
                  </CardDescription>
                </div>
              </div>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/admin/featured">
                  <Star className="w-4 h-4 mr-2" />
                  Manage Featured
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle>Instagram Feed</CardTitle>
                  <CardDescription className="text-pink-900/70">
                    Manage Instagram posts displayed on the homepage
                  </CardDescription>
                </div>
              </div>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/admin/instagram">
                  <Instagram className="w-4 h-4 mr-2" />
                  Manage Feed
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>Add, edit, or delete events and send notifications to subscribers</CardDescription>
              </div>
              <Button onClick={handleAddEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <EventList events={events} onEdit={handleEditEvent} onDelete={loadEvents} />
            )}
          </CardContent>
        </Card>
      </main>

      {showForm && <EventForm event={editingEvent} onClose={handleFormClose} />}
    </div>
  )
}
