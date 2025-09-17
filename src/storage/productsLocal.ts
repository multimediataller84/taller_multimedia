export type LocalProduct = {
  id: number; // ← ahora number
  name: string;
  category: string;
  cost: number;
  basePrice: number;
  stock: number;
  tax?: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
};

const KEY = "products_db";

// cargar todos los productos
export function loadProducts(): LocalProduct[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalProduct[]) : [];
  } catch {
    return [];
  }
}

// guardar lista completa
export function saveProducts(list: LocalProduct[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

// agregar un nuevo producto (genera id:number)
export function addProduct(
  p: Omit<LocalProduct, "id" | "createdAt" | "updatedAt">
): LocalProduct {
  const list = loadProducts();
  const now = new Date().toISOString();
  const newItem: LocalProduct = {
    ...p,
    id: Date.now(), // ← number
    createdAt: now,
    updatedAt: now,
  };
  list.push(newItem);
  saveProducts(list);
  return newItem;
}

// actualizar producto por id:number
export function updateProduct(
  id: number,
  changes: Partial<Omit<LocalProduct, "id" | "createdAt">>
): LocalProduct | null {
  const list = loadProducts();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated: LocalProduct = {
    ...list[index],
    ...changes,
    id: list[index].id, // asegurar que no cambie
    createdAt: list[index].createdAt,
    updatedAt: now,
  };
  list[index] = updated;
  saveProducts(list);
  return updated;
}

// eliminar producto por id:number
export function deleteProduct(id: number): boolean {
  const list = loadProducts();
  const newList = list.filter((p) => p.id !== id);
  if (newList.length === list.length) return false;
  saveProducts(newList);
  return true;
}

// limpiar todo
export function clearProducts() {
  localStorage.removeItem(KEY);
}
