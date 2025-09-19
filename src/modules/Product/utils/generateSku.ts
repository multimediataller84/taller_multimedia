export const generateSku = (seed?: {
  product_name?: string;
  category_id?: string | number;
}) => {
  const norm = (s: string) =>
    s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const slug =
    (seed?.product_name
      ? norm(seed.product_name)
          .replace(/[^a-zA-Z0-9]+/g, "")
          .toUpperCase()
          .slice(0, 3)
      : "PRD") || "PRD";
  const cat =
    seed?.category_id != null
      ? String(seed.category_id).padStart(2, "0")
      : "00";
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${slug}-${cat}-${rand}`;
};
