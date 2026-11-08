import { AdminMemberForm } from "@/components/AdminMemberForm";
import { listAllMembers } from "@/lib/members";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  const all = await listAllMembers();
  const nextSortOrder = all.length;

  return (
    <div className="admin-shell">
      <p>
        <Link href="/admin">← Back</Link>
      </p>
      <h1>Add member</h1>
      <AdminMemberForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
