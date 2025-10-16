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
import type { TUnitMeasure } from "../models/types/TUnitMeasure";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

// Enviamos COSTO en unit_price
const SEND_COST_INSTEAD_OF_PRICE = true;

// Redondear SIEMPRE hacia arriba al múltiplo de 50 más cercano
function roundUpToNearest50(n: number) {
  if (!Number.isFinite(n)) return 0;
  const step = 50;
  return Math.ceil(n / step) * step;
}

type ProductFormInputsWithCost = ProductFormInputs & {
  cost: string;
  unit_measure_id?: string;
};

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
      unit_price: "",   // aquí MOSTRAMOS el precio final (no se envía)
      stock: "",
      state: "Active",
      cost: "",         // costo que SÍ enviamos al back en unit_price
      unit_measure_id: "",
    },
  });

  const isEditing = !!initialData?.id;

  const productName     = watch("product_name");
  const categoryId      = watch("category_id");
  const costStr         = watch("cost");
  const profitPctStr    = watch("profit_margin");

  const [categories, setCategories] = useState<TCategoryEndpoint[]>([]);
  const [taxes, setTaxes] = useState<TTaxEndpoint[]>([]);
  const [unitMeasures, setUnitMeasures] = useState<TUnitMeasure[]>([]);
  const [skuStatus, setSkuStatus] = useState<"idle" | "checking" | "ok" | "dup">("idle");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      // Asumimos que unit_price en el back ES el costo (según cambio reciente).
      const costFromBack = Number((initialData as any)?.unit_price ?? 0);
      const marginCRC    = Number((initialData as any)?.profit_margin ?? 0);
      // Convertimos utilidad en colones a porcentaje para mostrar en el front.
      const inferredPct  = (Number.isFinite(costFromBack) && costFromBack > 0)
        ? Math.round((marginCRC / costFromBack) * 100)
        : Number(initialData.profit_margin ?? 0); // fallback si hubiera datos viejos

      // Calculamos el precio final redondeado para mostrar en el input de "Precio unitario"
      const priceUnrounded = Number.isFinite(costFromBack)
        ? costFromBack * (1 + (inferredPct || 0) / 100)
        : 0;
      const priceRounded = roundUpToNearest50(priceUnrounded);

      reset({
        product_name: initialData.product_name ?? "",
        sku: initialData.sku ?? "",
        category_id: String(initialData.category_id ?? ""),
        tax_id: String(initialData.tax_id ?? ""),
        profit_margin: String(inferredPct || 0),     // % visible
        unit_price: String(priceRounded || ""),      // precio mostrado (no se envía)
        stock: String(initialData.stock ?? ""),
        state: initialData.state ?? "Active",
        cost: Number.isFinite(costFromBack) ? String(costFromBack) : "",
        unit_measure_id:
          (initialData as any)?.unit_measure_id != null
            ? String((initialData as any).unit_measure_id)
            : "",
      });

      // Inyecta la opción del impuesto seleccionado
      if (initialData.tax_id != null) {
        const injected: TTaxEndpoint = {
          id: Number(initialData.tax_id),
          description: initialData.tax?.description ?? `Impuesto ${initialData.tax_id}`,
          name: initialData.tax?.name ?? "",
          percentage: initialData.tax?.percentage ?? 0,
        } as TTaxEndpoint;

        setTaxes(prev => {
          const already = prev.some(t => String(t.id) === String(injected.id));
          return already ? prev : [injected, ...prev];
        });
        setValue("tax_id", String(initialData.tax_id), { shouldValidate: false });
      }
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
        unit_measure_id: "",
      });
      setTaxes([]);
    }

    const loadBasics = async () => {
      try {
        const cats = await useCases.getAllCategories.execute();
        setCategories(cats);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
      try {
        const units = await useCases.getAllMeasure.execute();
        setUnitMeasures(units ?? []);
      } catch (err) {
        console.error("Error al cargar unidades de medida", err);
        setUnitMeasures([]);
      }
    };

    loadBasics();
    setSkuStatus("idle");
  }, [isOpen, initialData, reset, setValue]);

  // Impuestos por categoría (y aseguramos la opción seleccionada)
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const loadTaxes = async () => {
      try {
        const taxesResponse = await useCases.getAllTaxes.execute({
          description: categoryId || "",
          limit: 55,
          offset: 0,
          orderDirection: "ASC",
        });
        if (cancelled) return;

        let list = taxesResponse?.data ?? [];

        const selectedTaxId = initialData?.tax_id;
        if (selectedTaxId != null) {
          const hasSelected = list.some(t => String(t.id) === String(selectedTaxId));
          if (!hasSelected) {
            const injected: TTaxEndpoint = {
              id: Number(selectedTaxId),
              description: initialData?.tax?.description ?? `Impuesto ${selectedTaxId}`,
              name: initialData?.tax?.name ?? "",
              percentage: initialData?.tax?.percentage ?? 0,
            } as TTaxEndpoint;
            list = [injected, ...list];
          }
        }

        setTaxes(list);
      } catch (err) {
        console.error("Error al cargar impuestos", err);
        if (!isEditing) setTaxes([]);
      }
    };

    loadTaxes();
    return () => { cancelled = true; };
  }, [categoryId, isOpen, isEditing, initialData]);

  // Recalcular PRECIO mostrado (unit_price) desde COSTO + % de utilidad, con redondeo ↑ a múltiplo de 50
  useEffect(() => {
    const cost = Number(costStr);
    const p    = Number(profitPctStr);
    if (Number.isFinite(cost) && cost > 0 && Number.isFinite(p)) {
      const priceUnrounded = cost * (1 + p / 100);
      const priceRounded   = roundUpToNearest50(priceUnrounded);
      setValue("unit_price", priceRounded.toFixed(0), { shouldValidate: false });
    }
  }, [costStr, profitPctStr, setValue]);

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

  const formattedUnitOptions = (unitMeasures ?? []).map((u) => ({
    value: String(u.id),
    label: u.description ? `${u.description}${u.symbol ? ` (${u.symbol})` : ""}` : String(u.id),
  }));

  const submit = async (data: ProductFormInputsWithCost) => {
    const cost = Number(data.cost) || 0;
    const pct  = Number(data.profit_margin) || 0;
    // Precio final redondeado (el que se muestra)
    const priceRounded = roundUpToNearest50(cost * (1 + pct / 100));
    // Utilidad en colones para enviar
    const profitCRC = Math.max(priceRounded - cost, 0);

    const payload: any = {
      product_name: data.product_name,
      sku: data.sku,
      category_id: Number(data.category_id),
      tax_id: Number(data.tax_id),
      // 👇 Guardamos utilidad en colones en profit_margin (petición del cambio)
      profit_margin: profitCRC,
      // 👇 Enviamos COSTO en unit_price
      unit_price: SEND_COST_INSTEAD_OF_PRICE ? cost : priceRounded,
      stock: parseInt(data.stock, 10),
      state: data.state,
    };

    if (data.unit_measure_id) {
      payload.unit_measure_id = Number(data.unit_measure_id);
    }

    if (initialData?.id) {
      await useCases.patch.execute(initialData.id, payload as TProduct);
    } else {
      await useCases.post.execute(payload as TProduct);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    formattedCategoryOptions,
    formattedTaxesOptions,
    formattedUnitOptions,
    skuStatus,
    setSkuStatus,
    autoGenerateSku,
    submit,
    isEditing,
  };
}
