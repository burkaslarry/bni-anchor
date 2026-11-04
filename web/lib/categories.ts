export type CategoryId =
  | "it"
  | "professional"
  | "construction"
  | "lifestyle"
  | "marketing"
  | "fb"
  | "medical"
  | "education"
  | "finance";

export type Category = {
  id: CategoryId;
  zh: string;
  en: string;
  color: string;
};

export const BNI_CATEGORIES: Category[] = [
  { id: "it", zh: "資訊及創新科技", en: "Information Technology", color: "#c8102e" },
  { id: "professional", zh: "專業及企業服務", en: "Professional & Corporate Services", color: "#e36b1e" },
  { id: "construction", zh: "建築工程及環境衛生", en: "Construction & Engineering", color: "#c4a035" },
  { id: "lifestyle", zh: "生活品味及家庭服務", en: "Lifestyle & Family Services", color: "#2f9b6e" },
  { id: "marketing", zh: "市場推廣及展覽", en: "Marketing & Exhibition", color: "#5a8f3a" },
  { id: "fb", zh: "食品及餐飲", en: "Food & Beverage", color: "#1a9bb0" },
  { id: "medical", zh: "醫療、健康及運動", en: "Medical, Health & Sports", color: "#2f5fa8" },
  { id: "education", zh: "教育及培訓", en: "Education & Training", color: "#c44c3a" },
  { id: "finance", zh: "金融、投資及地產", en: "Finance, Investment & Property", color: "#6b3d91" },
];

export function categoryById(id: string): Category | undefined {
  return BNI_CATEGORIES.find((c) => c.id === id);
}
