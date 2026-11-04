import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminSeedButton } from "@/components/AdminSeedButton";
import { listAllMembers } from "@/lib/members";

export default async function AdminHomePage() {
  const members = await listAllMembers();

  return (
    <div className="admin-shell">
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1>Member admin</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/">View site</Link>
          <Link href="/admin/members/new">Add member</Link>
          <AdminLogoutButton />
        </div>
      </header>

      <p>
        Upload photos via member edit — server compresses to 512×512 WebP and stores on Vercel Blob. MongoDB Atlas
        holds member text and avatar URLs.
      </p>

      <AdminSeedButton />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Category</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.slug}>
              <td>{m.sortOrder}</td>
              <td>{m.name}</td>
              <td>{m.category}</td>
              <td>{m.published ? "Yes" : "No"}</td>
              <td>
                <Link href={`/admin/members/${m.slug}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
