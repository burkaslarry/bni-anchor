"use client";

import { BNI_CATEGORIES } from "@/lib/categories";
import type { Member } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  member?: Member;
  nextSortOrder: number;
};

const emptyMember = (sortOrder: number): Member => ({
  slug: "",
  name: "",
  companyZh: "",
  companyEn: "",
  professionZh: "",
  professionEn: "",
  category: "medical",
  introZh: "",
  introEn: "",
  websiteUrl: "",
  sortOrder,
  published: true,
  updatedAt: new Date(),
});

export function AdminMemberForm({ member, nextSortOrder }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Member>(member ?? emptyMember(nextSortOrder));
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setStatus("");
    try {
      let avatarUrl = form.avatarUrl;
      if (file && form.slug) {
        const body = new FormData();
        body.set("file", file);
        body.set("slug", form.slug);
        const up = await fetch("/api/admin/upload-avatar", { method: "POST", body });
        const upJson = (await up.json()) as { url?: string; error?: string };
        if (!up.ok) throw new Error(upJson.error ?? "Upload failed");
        avatarUrl = upJson.url;
      }

      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatarUrl }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setStatus("Saved.");
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!member?.slug) return;
    if (!confirm(`Delete ${member.name}?`)) return;
    setBusy(true);
    await fetch(`/api/admin/members?slug=${encodeURIComponent(member.slug)}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-form">
      <label>
        Slug (id)
        <input
          value={form.slug}
          disabled={Boolean(member)}
          onChange={(e) => setForm({ ...form, slug: e.target.value.trim().toLowerCase() })}
        />
      </label>
      <label>
        Name
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>
        Category
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as Member["category"] })}
        >
          {BNI_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.zh}
            </option>
          ))}
        </select>
      </label>
      <label>
        Profession (ZH)
        <input value={form.professionZh} onChange={(e) => setForm({ ...form, professionZh: e.target.value })} />
      </label>
      <label>
        Profession (EN)
        <input value={form.professionEn} onChange={(e) => setForm({ ...form, professionEn: e.target.value })} />
      </label>
      <label>
        Company (ZH)
        <input value={form.companyZh} onChange={(e) => setForm({ ...form, companyZh: e.target.value })} />
      </label>
      <label>
        Company (EN)
        <input value={form.companyEn} onChange={(e) => setForm({ ...form, companyEn: e.target.value })} />
      </label>
      <label>
        Website URL
        <input
          type="url"
          value={form.websiteUrl ?? ""}
          onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
          placeholder="https://"
        />
      </label>
      <label>
        Intro (ZH)
        <textarea value={form.introZh} onChange={(e) => setForm({ ...form, introZh: e.target.value })} rows={4} />
      </label>
      <label>
        Intro (EN)
        <textarea value={form.introEn} onChange={(e) => setForm({ ...form, introEn: e.target.value })} rows={4} />
      </label>
      <label>
        Sort order
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        Published on public directory
      </label>
      <label>
        Avatar (auto crop + WebP on upload)
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      {form.avatarUrl ? (
        <p>
          Current: <a href={form.avatarUrl}>{form.avatarUrl}</a>
        </p>
      ) : null}
      <div className="admin-actions">
        <button type="button" disabled={busy} onClick={save}>
          {busy ? "Saving…" : "Save member"}
        </button>
        {member ? (
          <button type="button" className="danger" disabled={busy} onClick={remove}>
            Delete
          </button>
        ) : null}
      </div>
      {status ? <p className="admin-status">{status}</p> : null}
    </div>
  );
}
