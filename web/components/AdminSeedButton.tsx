"use client";

export function AdminSeedButton() {
  return (
    <button
      type="button"
      style={{ margin: "16px 0" }}
      onClick={async () => {
        const res = await fetch("/api/admin/seed", { method: "POST" });
        const json = (await res.json()) as { error?: string; upserted?: number };
        if (!res.ok) {
          alert(json.error ?? "Seed failed");
          return;
        }
        alert(`Seed complete (${json.upserted ?? 0} records touched).`);
        window.location.reload();
      }}
    >
      Seed / refresh from legacy JSON (41 members)
    </button>
  );
}
