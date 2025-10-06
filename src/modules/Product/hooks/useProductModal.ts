import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { UseCasesController } from "../controllers/useCasesController";
import { ProductRepository } from "../repositories/productRepository";
import { TCategoryEndpoint } from "../models/types/TCategoryEndpoint";
import { generateSku } from "../utils/generateSku";
import { ProductFormInputs } from "../models/types/TProductsForm";
import { TTaxEndpoint } from "../models/types/TTaxEndpoint";
import type { TGetAllOptions } from "../../../models/types/TGetAllOptions";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

const COST_LS_KEY = "product_cost_by_sku";
type CostMap = Record<string, number>;

function readCostMap(): CostMap {
  try {
    const raw = localStorage.getItem(COST_LS_KEY);
    return raw ? (JSON.parse(raw) as CostMap) : {};
  } catch {
    return {};
  }
}
function writeCostMap(map: CostMap) {
  try {
    localStorage.setItem(COST_LS_KEY, JSON.stringify(map));
  } catch {}
}
function getCostForSku(sku?: string | null): string {
  if (!sku) return "";
  const map = readCostMap();
  const v = map[sku];
  return typeof v === "number" && isFinite(v) ? String(v) : "";
}
function setCostForSku(sku: string, cost: number) {
  if (!sku) return;
  const map = readCostMap();
  map[sku] = Number.isFinite(cost) ? Number(cost) : 0;
  writeCostMap(map);
}

export function useProductForm(
  initialData: TProductEndpoint | null,
  isOpen: boolean
) {
  const { register, handleSubmit, control, reset, setValue, watch } =
    useForm<ProductFormInputs & { cost?: string }>({
      defaultValues: {
        product_name: "",
        sku: "",
        category_id: "",
        tax_id: "",
        profit_margin: "",
        unit_price: "",
        stock: "",
        state: "Active",
        cost: "",
      },
    });

  const isEditing = !!initialData?.id;

  const productName = watch("product_name");
  const categoryId = watch("category_id");
  const sku = watch("sku");
  const unitPriceStr = watch("unit_price");
  const costStr = watch("cost");

  const [categories, setCategories] = useState<TCategoryEndpoint[]>([]);
  const [taxes, setTaxes] = useState<TTaxEndpoint[]>([]);
  const [skuStatus, setSkuStatus] = useState<"idle" | "checking" | "ok" | "dup">("idle");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const pm = initialData.profit_margin;
      const pmInt = (pm ?? pm === 0) ? String(Math.round(Number(pm) * 100)) : "";

      reset({
        product_name: initialData.product_name ?? "",
        sku: initialData.sku ?? "",
        category_id: String(initialData.category_id ?? ""),
        tax_id: String(initialData.tax_id ?? ""),
        profit_margin: pmInt, // entero en UI
        unit_price: String(initialData.unit_price ?? ""),
        stock: String(initialData.stock ?? ""),
        state: initialData.state ?? "Active",
        cost: getCostForSku(initialData.sku),
      });
    } else {
      reset({
        product_name: "",
        sku: "",
        category_id: "",
        tax_id: "",
        profit_margin: "",
        unit_price: "",
        stock: "",
        state: "Active",
        cost: "",
      });
    }

    const loadCategories = async () => {
      try {
        const cats = await useCases.getAllCategories.execute();
        setCategories(cats);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };

    loadCategories();
    setSkuStatus("idle");
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const loadTaxes = async () => {
      try {
        const options = {
          description: categoryId,
          limit: 55,
          offset: 0,
          orderDirection: "ASC",
        } as TGetAllOptions;

        const taxesResponse = await useCases.getAllTaxes.execute(options);
        setTaxes(taxesResponse.data || []);
      } catch (err) {
        console.error("Error al cargar impuestos", err);
        setTaxes([]);
      }
    };

    setValue("tax_id", "");
    loadTaxes();
  }, [categoryId, isOpen, setValue]);

  const autoGenerateSku = () => {
    const generated = generateSku({
      product_name: productName,
      category_id: categoryId,
    });
    setValue("sku", generated);
    setValue("cost", getCostForSku(generated));
    setSkuStatus("idle");
  };

  useEffect(() => {
    const price = parseFloat(String(unitPriceStr ?? "").replace(",", "."));
    const cost = parseFloat(String(costStr ?? "").replace(",", "."));

    if (Number.isFinite(price) && Number.isFinite(cost) && cost > 0) {
      const profit = price - cost;
      const markup = profit / cost;
      const pctInt = Math.round(markup * 100); 
      const bounded = Number.isFinite(pctInt) ? Math.max(-100000000, Math.min(100000000, pctInt)) : NaN;
      setValue("profit_margin", Number.isFinite(bounded) ? String(bounded) : "");
    } else {
      setValue("profit_margin", "");
    }
  }, [unitPriceStr, costStr, setValue]);

  const formattedCategoryOptions = categories.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const formattedTaxesOptions = taxes.map((item) => ({
    value: item.id.toString(),
    label: item.description,
  }));

  const submit = async (data: ProductFormInputs & { cost?: string }) => {
    const pmInt = data.profit_margin === "" ? 0 : parseFloat(data.profit_margin);
    const pmDecimal = Number.isFinite(pmInt) ? pmInt / 100 : 0; 

    const payload: TProduct = {
      product_name: data.product_name,
      sku: data.sku,
      category_id: Number(data.category_id),
      tax_id: Number(data.tax_id),
      profit_margin: pmDecimal, 
      unit_price: parseFloat(data.unit_price),
      stock: parseInt(data.stock, 10),
      state: data.state,
    };

    if (initialData?.id) {
      await useCases.patch.execute(initialData.id, payload);
    } else {
      await useCases.post.execute(payload);
    }

    const cleanSku = (data.sku || "").trim();
    const cleanCost = parseFloat(String(data.cost ?? "").trim());
    if (cleanSku && Number.isFinite(cleanCost)) {
      setCostForSku(cleanSku, cleanCost);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    formattedCategoryOptions,
    formattedTaxesOptions,
    skuStatus,
    setSkuStatus,
    autoGenerateSku,
    submit,
    isEditing,
  };
}
