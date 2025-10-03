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
  } = useForm<ProductFormInputs>({
    defaultValues: {
      product_name: "",
      sku: "",
      category_id: "",
      tax_id: "",
      profit_margin: "",
      unit_price: "",
      stock: "",
      state: "Active",
    },
  });

  const isEditing = !!initialData?.id;

  const productName = watch("product_name");
  const categoryId = watch("category_id");

  const [categories, setCategories] = useState<TCategoryEndpoint[]>([]);
  const [taxes, setTaxes] = useState<TTaxEndpoint[]>([]);
  const [skuStatus, setSkuStatus] = useState<"idle" | "checking" | "ok" | "dup">("idle");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      reset({
        product_name: initialData.product_name ?? "",
        sku: initialData.sku ?? "",
        category_id: String(initialData.category_id ?? ""),
        tax_id: String(initialData.tax_id ?? ""),
        profit_margin: String(initialData.profit_margin ?? ""),
        unit_price: String(initialData.unit_price ?? ""),
        stock: String(initialData.stock ?? ""),
        state: initialData.state ?? "Active",
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
      });
    }

    const loadCategories = async () => {
      try {
        const categories = await useCases.getAllCategories.execute();
        setCategories(categories);
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
      setTaxes(taxesResponse.data);
    } catch (err) {
      console.error("Error al cargar impuestos", err);
      setTaxes([]);
    }
  };

    loadTaxes();
  }, [categoryId, isOpen]);

  // SKU auto
  const autoGenerateSku = () => {
    const generated = generateSku({
      product_name: productName,
      category_id: categoryId,
    });
    setValue("sku", generated);
    setSkuStatus("idle");
  };

  // Opciones para selects
  const formattedCategoryOptions = categories.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const formattedTaxesOptions = taxes.map((item) => ({
    value: item.id.toString(),
    label: item.description,
  }));

  // Guardar (crear/editar)
  const submit = async (data: ProductFormInputs) => {
    const payload: TProduct = {
      product_name: data.product_name,
      sku: data.sku,
      category_id: Number(data.category_id),
      tax_id: Number(data.tax_id),
      profit_margin: parseFloat(data.profit_margin),
      unit_price: parseFloat(data.unit_price),
      stock: parseInt(data.stock, 10),
      state: data.state,
    };

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
