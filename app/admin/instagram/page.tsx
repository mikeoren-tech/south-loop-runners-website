"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Instagram,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface InstagramPost {
  id: number
  URL: string
  caption?: string
  display_order: number
  is_active: number
  created_at: string
}

export default function InstagramAdmin() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    URL: "",
    caption: "",
    display_order: 0,
  })

  // Separate active and hidden posts
  const activePosts = posts.filter((post) => post.is_active === 1)
  const hiddenPosts = posts.filter((post) => post.is_active === 0)

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
      loadPosts()
    }
  }, [isAuthenticated])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/admin/instagram", {
        cache: "no-store",
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to load Instagram posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPost = () => {
    setEditingPost(null)
    setFormData({ URL: "", caption: "", display_order: activePosts.length })
    setShowForm(true)
  }

  const handleEditPost = (post: InstagramPost) => {
    setEditingPost(post)
    setFormData({
      URL: post.URL,
      caption: post.caption || "",
      display_order: post.display_order,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingPost ? `/api/admin/instagram/${editingPost.id}` : "/api/admin/instagram"
      const method = editingPost ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          is_active: editingPost ? editingPost.is_active : 1,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        loadPosts()
      } else {
        const result = await response.json()
        alert(result.error || "Failed to save post")
      }
    } catch (error) {
      alert("Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Instagram post?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/instagram/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadPosts()
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("Failed to delete post")
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (post: InstagramPost) => {
    try {
      const response = await fetch(`/api/admin/instagram/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          is_active: post.is_active ? 0 : 1,
        }),
      })

      if (response.ok) {
        loadPosts()
      } else {
        alert("Failed to toggle visibility")
      }
    } catch (error) {
      alert("Failed to toggle visibility")
    }
  }

  const moveUp = async (postList: InstagramPost[], index: number) => {
    if (index === 0) return

    const newOrder = [...postList]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp

    const allPosts = [...(postList === activePosts ? hiddenPosts : activePosts), ...newOrder].sort(
      (a, b) => a.display_order - b.display_order
    )
    setPosts(allPosts)
    await saveOrder(allPosts.map((post) => post.id))
  }

  const moveDown = async (postList: InstagramPost[], index: number) => {
    if (index === postList.length - 1) return

    const newOrder = [...postList]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp

    const allPosts = [...(postList === activePosts ? hiddenPosts : activePosts), ...newOrder].sort(
      (a, b) => a.display_order - b.display_order
    )
    setPosts(allPosts)
    await saveOrder(allPosts.map((post) => post.id))
  }

  const saveOrder = async (postIds: number[]) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/instagram/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postIds }),
      })

      if (!response.ok) {
        alert("Failed to save order")
        await loadPosts()
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      alert("Failed to save order")
      await loadPosts()
    } finally {
      setSaving(false)
    }
  }

  const PostItem = ({ post, index, list }: { post: InstagramPost; index: number; list: InstagramPost[] }) => (
    <div
      key={post.id}
      className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
    >
      {/* Left: Reorder Controls */}
      <div className="flex flex-col gap-1 pt-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveUp(list, index)}
          disabled={index === 0}
          className="h-8 w-8 p-0"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveDown(list, index)}
          disabled={index === list.length - 1}
          className="h-8 w-8 p-0"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Center: Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs">
            #{index + 1}
          </Badge>
        </div>

        <div className="text-sm break-all">
          <a href={post.URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {post.URL}
          </a>
        </div>

        {post.caption && <p className="text-sm text-muted-foreground line-clamp-2">{post.caption}</p>}
      </div>

      {/* Right: Action Controls */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleActive(post)}
          title={post.is_active ? "Hide from homepage" : "Show on homepage"}
        >
          {post.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(post.id)}
          disabled={deleting === post.id}
        >
          {deleting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Instagram className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Instagram Feed Manager</h1>
            </div>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Featured Posts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Featured Posts ({activePosts.length})</CardTitle>
                <CardDescription>
                  Posts displayed on the homepage. Up to 6 posts are shown. Use the arrows to reorder.
                </CardDescription>
              </div>
              <Button onClick={handleAddPost}>
                <Plus className="w-4 h-4 mr-2" />
                Add Post
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : activePosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No featured Instagram posts yet. Click "Add Post" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {activePosts.map((post, index) => (
                  <PostItem key={post.id} post={post} index={index} list={activePosts} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden Posts Section */}
        {hiddenPosts.length > 0 && (
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Hidden Posts ({hiddenPosts.length})</CardTitle>
                <CardDescription>These posts are not displayed on the homepage.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hiddenPosts.map((post, index) => (
                  <PostItem key={post.id} post={post} index={index} list={hiddenPosts} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {showForm && (
        <Dialog open onOpenChange={() => setShowForm(false)}>
          <DialogContent className="bg-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Instagram Post" : "Add Instagram Post"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="URL">Instagram Post URL*</Label>
                <Input
                  id="URL"
                  type="url"
                  value={formData.URL}
                  onChange={(e) => setFormData({ ...formData, URL: e.target.value })}
                  placeholder="https://www.instagram.com/p/..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Copy the URL from the Instagram post (e.g., https://www.instagram.com/p/ABC123/)
                </p>
              </div>

              <div>
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Optional description or caption"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingPost ? "Update Post" : "Add Post"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}