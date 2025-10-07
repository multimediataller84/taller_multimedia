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

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

type ProductFormInputsWithCost = ProductFormInputs & { cost: string };

function inferCostFromPriceAndMarkup(unitPrice?: number, markupPct?: number) {
  const price = Number(unitPrice);
  const pct = Number(markupPct);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(pct)) return "";
  const cost = price / (1 + pct / 100);
  return cost > 0 ? cost.toFixed(2) : "";
}

export function useProductForm(
  initialData: TProductEndpoint | null,
  isOpen: boolean
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
  } = useForm<ProductFormInputsWithCost>({
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
  const categoryId  = watch("category_id");
  const unitPrice   = watch("unit_price");
  const costStr     = watch("cost");

  const [categories, setCategories] = useState<TCategoryEndpoint[]>([]);
  const [taxes, setTaxes] = useState<TTaxEndpoint[]>([]);
  const [skuStatus, setSkuStatus] = useState<"idle" | "checking" | "ok" | "dup">("idle");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const inferredCost = inferCostFromPriceAndMarkup(
        initialData.unit_price as any,
        initialData.profit_margin as any
      );

      reset({
        product_name: initialData.product_name ?? "",
        sku: initialData.sku ?? "",
        category_id: String(initialData.category_id ?? ""),
        tax_id: String(initialData.tax_id ?? ""),
        profit_margin: String(initialData.profit_margin ?? ""),
        unit_price: String(initialData.unit_price ?? ""),
        stock: String(initialData.stock ?? ""),
        state: initialData.state ?? "Active",
        cost: inferredCost || "",
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
        const taxesResponse = await useCases.getAllTaxes.execute({
          description: categoryId || "",
          limit: 55,
          offset: 0,
          orderDirection: "ASC",
        });
        setTaxes(taxesResponse.data);
      } catch (err) {
        console.error("Error al cargar impuestos", err);
        setTaxes([]);
      }
    };

    loadTaxes();
  }, [categoryId, isOpen]);

  useEffect(() => {
    const price = Number(unitPrice);
    const c = Number(costStr);
    if (Number.isFinite(price) && price > 0 && Number.isFinite(c) && c > 0) {
      const pct = ((price - c) / c) * 100;
      setValue("profit_margin", String(Math.round(pct)), { shouldValidate: false });
    }
  }, [unitPrice, costStr, setValue]);

  const autoGenerateSku = () => {
    const generated = generateSku({
      product_name: productName,
      category_id: categoryId,
    });
    setValue("sku", generated);
    setSkuStatus("idle");
  };

  const formattedCategoryOptions = categories.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const formattedTaxesOptions = taxes.map((item) => ({
    value: item.id.toString(),
    label: item.description,
  }));

  const submit = async (data: ProductFormInputsWithCost) => {
    const price = Number(data.unit_price);
    const c = Number(data.cost);
    let profit = Number(data.profit_margin);
    if (Number.isFinite(price) && price > 0 && Number.isFinite(c) && c > 0) {
      profit = Math.round(((price - c) / c) * 100);
    }

    const payload: TProduct = {
      product_name: data.product_name,
      sku: data.sku,
      category_id: Number(data.category_id),
      tax_id: Number(data.tax_id),
      profit_margin: profit,
      unit_price: parseFloat(String(price)),
      stock: parseInt(data.stock, 10),
      state: data.state,
    } as unknown as TProduct;

    if (initialData?.id) {
      await useCases.patch.execute(initialData.id, payload);
    } else {
      await useCases.post.execute(payload);
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
