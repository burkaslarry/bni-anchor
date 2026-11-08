"use client";

import { BANNER_ASPECT_LABEL, BANNER_MAX_BOUND_PX, BANNER_RECOMMENDED_PX } from "@/lib/banner-constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  imageUrl: string;
  alt: string;
};

export function AdminBannerForm({ imageUrl, alt }: Props) {
  const router = useRouter();
  const [altText, setAltText] = useState(alt);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveAltOnly() {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/site-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: altText, imageUrl }),
      });
      const text = await res.text();
      if (!res.ok) {
        try {
          const j = JSON.parse(text) as { error?: string };
          throw new Error(j.error ?? "Save failed");
        } catch (e) {
          if (e instanceof Error && e.message !== "Save failed") throw e;
          throw new Error(text.slice(0, 200) || "Save failed");
        }
      }
      setStatus("Alt text saved.");
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function uploadBanner() {
    if (!file) {
      setStatus("Choose a photo first.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("alt", altText);
      const res = await fetch("/api/admin/upload-banner", { method: "POST", body });
      const text = await res.text();
      if (!res.ok) {
        try {
          const j = JSON.parse(text) as { error?: string };
          throw new Error(j.error ?? "Upload failed");
        } catch (e) {
          if (e instanceof Error && e.message !== "Upload failed") throw e;
          throw new Error(text.slice(0, 200) || "Upload failed");
        }
      }
      setStatus("Banner updated on the public homepage.");
      setFile(null);
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-banner-card">
      <h2>Homepage group photo (banner)</h2>
      <p>
        Replaces the main site banner above the member directory. Use a <strong>wide group / leadership</strong> photo.
      </p>
      <p className="admin-banner-hint">
        <strong>Aspect ratio:</strong> {BANNER_ASPECT_LABEL} (landscape). Recommended size: {BANNER_RECOMMENDED_PX}.
        The image is fit within {BANNER_MAX_BOUND_PX} — wider or taller originals are shrunk, not cropped. Avoid very
        tall/portrait photos.
      </p>
      <p className="admin-banner-hint-zh">
        建議比例 <strong>16:9</strong>（橫向），例如 1920×1080 或 1600×900。直相或過窄的相會留黑邊或顯得細。
      </p>
      <div className="admin-banner-preview">
        <img src={imageUrl} alt={altText} />
      </div>
      <label>
        Alt text (accessibility / caption)
        <input value={altText} onChange={(e) => setAltText(e.target.value)} />
      </label>
      <div className="admin-actions">
        <button type="button" disabled={busy} onClick={saveAltOnly}>
          Save alt text only
        </button>
      </div>
      <label>
        New banner image
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <div className="admin-actions">
        <button type="button" disabled={busy || !file} onClick={uploadBanner}>
          {busy ? "Uploading…" : "Upload & publish banner"}
        </button>
      </div>
      {status ? <p className="admin-status">{status}</p> : null}
    </section>
  );
}
