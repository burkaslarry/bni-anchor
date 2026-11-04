import type { CategoryId } from "./categories";

export type Member = {
  slug: string;
  name: string;
  companyZh: string;
  companyEn: string;
  professionZh: string;
  professionEn: string;
  category: CategoryId;
  roleZh?: string;
  roleEn?: string;
  introZh: string;
  introEn: string;
  keywords?: string;
  instagram?: string[];
  websiteUrl?: string;
  lookingForZh?: string[];
  lookingForEn?: string[];
  gold?: boolean;
  avatarUrl?: string;
  sortOrder: number;
  published: boolean;
  updatedAt: Date;
};

export type MemberInput = Omit<Member, "updatedAt"> & { updatedAt?: Date };

export type LegacyMember = {
  id: string;
  name: string;
  companyZh?: string;
  companyEn?: string;
  professionZh: string;
  professionEn: string;
  category: CategoryId;
  roleZh?: string;
  roleEn?: string;
  introZh: string;
  introEn: string;
  keywords?: string;
  instagram?: string[];
  gold?: boolean;
  lookingForZh?: string[];
  lookingForEn?: string[];
};
