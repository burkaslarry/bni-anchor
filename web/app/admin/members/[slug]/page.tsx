import { AdminMemberForm } from "@/components/AdminMemberForm";
import { getMemberBySlug, listAllMembers } from "@/lib/members";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function EditMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();
  const all = await listAllMembers();
  const nextSortOrder = all.length;

  return (
    <div className="admin-shell">
      <p>
        <Link href="/admin">← Back</Link>
      </p>
      <h1>Edit {member.name}</h1>
      <AdminMemberForm member={member} nextSortOrder={nextSortOrder} />
    </div>
  );
}
