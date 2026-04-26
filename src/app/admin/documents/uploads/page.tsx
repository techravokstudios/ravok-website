"use client";

import { useEffect, useState } from "react";
import {
  getDocumentCategories,
  type DocumentCategory,
  uploadInvestorDocuments,
  listInvestorDocuments,
  deleteInvestorDocument,
  replaceInvestorDocumentFile,
  type InvestorDocument,
  storageUrl,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "@/lib/toast";
import { quickShareDocument } from "@/lib/api/v1/rooms";

export default function AdminDocumentsUploadPage() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [list, setList] = useState<InvestorDocument[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const cats = await getDocumentCategories();
        setCategories(cats);
        if (cats[0]) setCategoryId(cats[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load categories");
      }
    }
    init();
    refreshList();
  }, []);

  async function refreshList() {
    setLoadingList(true);
    try {
      const res = await listInvestorDocuments(1);
      setList(res.data);
    } catch (e) {
      // ignore
    } finally {
      setLoadingList(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!categoryId) {
      setError("Please choose a category");
      return;
    }
    if (files.length === 0) {
      setError("Please select one or more files");
      return;
    }
    try {
      await uploadInvestorDocuments({
        document_category_id: categoryId,
        name,
        description,
        files,
      });
      setSuccess("Uploaded successfully");
      toast.success("Uploaded successfully");
      setName("");
      setDescription("");
      setFiles([]);
      const input = document.getElementById("files") as HTMLInputElement | null;
      if (input) input.value = "";
      await refreshList();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-4">
        Investor Documents — Upload
      </h1>
      {error && (
        <div className="mb-4 p-3 rounded border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded border border-emerald-500/30 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-ravok-slate mb-1">Category</label>
            <select
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ravok-slate mb-1">Name</label>
            <Input
              placeholder="Required – used as base name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-ravok-slate mb-1">Description</label>
          <Textarea
            placeholder="Required – applied to all uploaded files"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-ravok-slate mb-1">Files</label>
          <Input
            id="files"
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <p className="text-xs text-ravok-slate mt-1">
            Allowed: JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, ZIP (max 20MB each)
          </p>
        </div>

        <Button type="submit">Upload</Button>
      </form>

      <div>
        <h2 className="text-lg font-heading text-ravok-gold mb-3">Recent uploads</h2>
        {loadingList ? (
          <p className="text-ravok-slate">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-ravok-slate">No documents yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(
              list.reduce<Record<string, InvestorDocument[]>>((acc, d) => {
                const key = d.group_key || `${d.name}::${d.description}`;
                (acc[key] ||= []).push(d);
                return acc;
              }, {})
            ).map(([key, docs]) => {
              // Take common fields from first doc in group
              const head = docs[0];
              return (
                <div key={key} className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="mb-2">
                    <div className="text-white font-semibold">{head.name}</div>
                    <div className="text-sm text-ravok-slate mt-1">{head.description}</div>
                    <div className="text-xs text-ravok-slate mt-1">{head.category?.name ?? "Uncategorized"}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs.map((d) => {
                      const isImage = (d.mime_type ?? "").startsWith("image/");
                      return (
                        <div key={d.id} className="flex items-start justify-between gap-3 rounded border border-white/10 p-3 bg-black/30">
                          <div className="min-w-0 flex-1">
                            <div className="text-white text-sm font-medium truncate">
                              {d.original_name || d.name}
                            </div>
                            {isImage && (
                              <a href={storageUrl(d.file_path)} target="_blank" className="block mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={storageUrl(d.file_path)}
                                  alt={d.original_name || d.name}
                                  className="max-h-28 rounded border border-white/10"
                                />
                              </a>
                            )}
                            <div className="text-xs text-ravok-slate mt-1">
                              {(d.size_bytes / 1024).toFixed(1)} KB
                            </div>
                            <Link
                              href={storageUrl(d.file_path)}
                              target="_blank"
                              className="text-xs text-ravok-gold hover:underline"
                            >
                              {isImage ? "View / Download" : "Download"}
                            </Link>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const room = await quickShareDocument(d.id);
                                  const link = `${window.location.origin}/room/${room.slug}`;
                                  await navigator.clipboard.writeText(link);
                                  toast.success(`Share link copied: ${link}`);
                                } catch (e) {
                                  toast.error(e instanceof Error ? e.message : "Failed to create share link");
                                }
                              }}
                            >
                              Share
                            </Button>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    await replaceInvestorDocumentFile(d.id, file);
                                    toast.success("File replaced. All existing share links now point to the new version.");
                                    await refreshList();
                                  } catch (err) {
                                    toast.error(err instanceof Error ? err.message : "Replace failed");
                                  }
                                  e.target.value = "";
                                }}
                              />
                              <span className="inline-flex h-7 items-center rounded border border-white/20 px-2 text-xs font-sans text-white/80 hover:border-ravok-gold/40 hover:text-ravok-gold">
                                Replace
                              </span>
                            </label>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => setConfirmId(d.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Confirm Delete Modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-black p-5">
            <h3 className="text-lg font-heading text-white mb-2">Are you sure?</h3>
            <p className="text-sm text-ravok-slate mb-4">This will permanently delete the selected file.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  const id = confirmId;
                  setConfirmId(null);
                  try {
                    await deleteInvestorDocument(id as number);
                    toast.success("File deleted");
                    await refreshList();
                  } catch (e) {
                    const msg = e instanceof Error ? e.message : "Delete failed";
                    toast.error(msg);
                    setError(msg);
                  }
                }}
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
