"use client";

import { Button } from "@/lib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getPost, getCategories, createCategory, updatePost, uploadPostImage, getPostImageUrl, type Category } from "@/lib/api";
import { toast } from "@/lib/toast";
import { ChevronLeft, Plus, X } from "lucide-react";
import { RichTextEditor } from "@/modules/blog/components/RichTextEditor";

export default function AdminPostsEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState(getStoredUser());
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [featuredImagePath, setFeaturedImagePath] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== "admin") {
      router.replace(u ? "/pending" : "/login");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    getCategories(1).then((res) => setCategories(res.data)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user || !id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      toast.error("Invalid post");
      setLoading(false);
      return;
    }
    setLoading(true);
    getPost(numId)
      .then((post) => {
        setCategoryId(post.category ? String(post.category.id) : "");
        setTitle(post.title);
        setBody(post.body);
        setFeaturedImagePath(post.featured_image ?? null);
        setIsFeatured(!!post.is_featured);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load post"))
      .finally(() => setLoading(false));
  }, [user, id]);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const cat = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || null,
      });
      setCategories((prev) => [...prev, cat]);
      setCategoryId(String(cat.id));
      setNewCategoryName("");
      setNewCategoryDescription("");
      setAddCategoryOpen(false);
      toast.success("Category added.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) return;
    const catId = categoryId ? parseInt(categoryId, 10) : 0;
    if (!catId || !title.trim() || !body.trim()) {
      toast.error("Category, title and body are required.");
      return;
    }
    setSubmitting(true);
    try {
      let finalFeaturedImage: string | null = featuredImagePath;
      if (featuredImageFile) {
        const path = await uploadPostImage(featuredImageFile);
        finalFeaturedImage = path;
      }
      await updatePost(numId, {
        category_id: catId,
        title: title.trim(),
        body: body.trim(),
        featured_image: finalFeaturedImage,
        is_featured: isFeatured,
      });
      toast.success("Post updated.");
      router.push("/admin/posts");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to posts
      </Link>

      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold mb-2">
        Edit post
      </h1>
      <p className="text-sm font-sans text-ravok-slate mb-6">Update post details (publish date = created at)</p>

      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : (
        <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="font-heading text-lg text-ravok-gold">Edit post</CardTitle>
            <CardDescription className="font-sans text-sm text-ravok-slate">
              Category, title, body and optional featured flag
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="category" className="text-white/90 font-sans">Category</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-ravok-gold/50 text-ravok-gold hover:bg-ravok-gold/10 text-xs h-7"
                    onClick={() => setAddCategoryOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add category
                  </Button>
                </div>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white font-sans text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/90 font-sans">Featured image (optional)</Label>
                <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-black/30 text-ravok-slate text-sm">
                    {featuredImagePath ? (
                      <img src={getPostImageUrl(featuredImagePath)!} alt="" className="h-full w-full object-cover" />
                    ) : featuredImageFile ? (
                      <img src={URL.createObjectURL(featuredImageFile)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Input
                      type="file"
                      accept="image/*"
                      className="border-white/20 bg-black/30 text-white file:mr-2 file:rounded file:border-0 file:bg-ravok-gold file:px-3 file:py-1 file:text-black file:text-sm"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setFeaturedImageFile(file);
                        setUploadingImage(true);
                        try {
                          const path = await uploadPostImage(file);
                          setFeaturedImagePath(path);
                        } catch {
                          toast.error("Failed to upload image");
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                    />
                    {uploadingImage && <p className="text-xs text-ravok-slate">Uploading…</p>}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="title" className="text-white/90 font-sans">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="Post title"
                  required
                />
              </div>
              <div>
                <Label className="text-white/90 font-sans">Body</Label>
                <div className="mt-1">
                  <RichTextEditor
                    value={body}
                    onChange={setBody}
                    minHeight="200px"
                    onUploadImage={async (file) => {
                      const path = await uploadPostImage(file);
                      return getPostImageUrl(path) ?? "";
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/30 text-ravok-gold focus:ring-ravok-gold"
                />
                <Label htmlFor="is_featured" className="text-white/90 font-sans cursor-pointer">Is featured</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-ravok-gold text-black hover:bg-ravok-gold/90"
                  disabled={submitting || !title.trim() || !body.trim() || !categoryId}
                >
                  {submitting ? "Saving…" : "Save"}
                </Button>
                <Link href="/admin/posts">
                  <Button type="button" variant="outline" className="border-white/20 text-white">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {addCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" aria-modal="true">
          <Card className="w-full max-w-md border border-white/10 bg-black/95 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
              <CardTitle className="font-heading text-lg text-ravok-gold">Add category</CardTitle>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setAddCategoryOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <Label htmlFor="new-cat-name" className="text-white/90 font-sans">Name</Label>
                  <Input
                    id="new-cat-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="mt-1 bg-black/30 border-white/20 text-white"
                    placeholder="Category name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="new-cat-desc" className="text-white/90 font-sans">Description (optional)</Label>
                  <Input
                    id="new-cat-desc"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="mt-1 bg-black/30 border-white/20 text-white"
                    placeholder="Short description"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="bg-ravok-gold text-black hover:bg-ravok-gold/90" disabled={addingCategory || !newCategoryName.trim()}>
                    {addingCategory ? "Adding…" : "Add category"}
                  </Button>
                  <Button type="button" variant="outline" className="border-white/20 text-white" onClick={() => setAddCategoryOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
