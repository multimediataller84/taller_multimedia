import { useEffect, useState } from "react";
import { ProductRepository } from "../../Product/repositories/productRepository";
import { UseCasesController } from "../../Product/controllers/useCasesController";
import type { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

export function useProductStats() {
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await useCases.getAll.execute({ limit: 1000, offset: 0, orderDirection: "ASC" });
        const rows = (res.data ?? []) as TProductEndpoint[];
        let a = 0, i = 0;
        for (const p of rows) {
          if (String(p.state) === "Active") a++;
          else if (String(p.state) === "Inactive") i++;
        }
        setActive(a);
        setInactive(i);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { active, inactive, loading };
}
