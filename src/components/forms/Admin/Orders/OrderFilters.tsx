import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import type { OrderFilters, BackendOrderStatus } from "@/types/order.types";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return undefined;
};

const filterSchema = z.object({
  orderId: z.preprocess(emptyStringToUndefined, z.string().optional()),
  status: z.preprocess(
    emptyStringToUndefined,
    z
      .enum([
        "pending",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .optional(),
  ),
  deliveryMethod: z.preprocess(
    emptyStringToUndefined,
    z.enum(["delivery", "pickup"]).optional(),
  ),
  email: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
  createdAfter: z.preprocess(emptyStringToUndefined, z.string().optional()),
  createdBefore: z.preprocess(emptyStringToUndefined, z.string().optional()),
});

type OrderFilterFormValues = z.infer<typeof filterSchema>;

const statusOptions: { label: string; value: BackendOrderStatus }[] = [
  { label: "Pendiente", value: "pending" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Preparando", value: "preparing" },
  { label: "Listo para recoger", value: "ready_for_pickup" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregado", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
];

const deliveryMethodOptions = [
  { label: "Domicilio", value: "delivery" },
  { label: "Recogida", value: "pickup" },
];

const formatLocalDateTimeToIso = (value: unknown) => {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const date = new Date(trimmed);
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
};

const formatIsoToDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
};

interface OrderFiltersProps {
  defaultValues?: OrderFilters;
  onSubmit: (filters: OrderFilters) => void;
  onClear: () => void;
}

export const OrderFiltersComponent = ({
  defaultValues,
  onSubmit,
  onClear,
}: OrderFiltersProps) => {
  const form = useForm<OrderFilterFormValues>({
    resolver: zodResolver(filterSchema) as Resolver<OrderFilterFormValues>,
    defaultValues: {
      orderId: defaultValues?.orderId ?? "",
      status: defaultValues?.status ?? undefined,
      deliveryMethod: defaultValues?.deliveryMethod ?? "delivery",
      email: defaultValues?.email ?? "",
      createdAfter: formatIsoToDateTimeLocal(defaultValues?.createdAfter),
      createdBefore: formatIsoToDateTimeLocal(defaultValues?.createdBefore),
    },
  });

  useEffect(() => {
    form.reset({
      orderId: defaultValues?.orderId ?? "",
      status: defaultValues?.status ?? undefined,
      deliveryMethod: defaultValues?.deliveryMethod ?? "delivery",
      email: defaultValues?.email ?? "",
      createdAfter: formatIsoToDateTimeLocal(defaultValues?.createdAfter),
      createdBefore: formatIsoToDateTimeLocal(defaultValues?.createdBefore),
    });
  }, [defaultValues, form]);

  const handleSubmit = (values: OrderFilterFormValues) => {
    onSubmit({
      orderId: values.orderId?.trim() || undefined,
      status: values.status || undefined,
      deliveryMethod: values.deliveryMethod || undefined,
      email: values.email?.trim().toLowerCase() || undefined,
      createdAfter: formatLocalDateTimeToIso(values.createdAfter),
      createdBefore: formatLocalDateTimeToIso(values.createdBefore),
    });
  };

  const handleClear = () => {
    form.reset({
      orderId: "",
      status: undefined,
      deliveryMethod: "delivery",
      email: "",
      createdAfter: "",
      createdBefore: "",
    });
    onClear();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field>
          <FieldLabel>ID de Orden</FieldLabel>
          <Input
            type="text"
            placeholder="UUID de orden"
            {...form.register("orderId")}
          />
        </Field>

        <Controller
          name="status"
          control={form.control}
          render={({ field }) => {
            const selectedStatusLabel = statusOptions.find(
              (item) => item.value === field.value,
            )?.label;

            return (
              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={(next) =>
                    field.onChange(next === "" ? undefined : next)
                  }
                >
                  <SelectTrigger className="w-full" onBlur={field.onBlur}>
                    <SelectValue placeholder="Selecciona estado">
                      {selectedStatusLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Todos</SelectItem>
                      {statusOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        <Controller
          name="deliveryMethod"
          control={form.control}
          render={({ field }) => {
            const selectedDeliveryMethodLabel = deliveryMethodOptions.find(
              (item) => item.value === field.value,
            )?.label;

            return (
              <Field>
                <FieldLabel>Método de entrega</FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={(next) =>
                    field.onChange(next === "" ? undefined : next)
                  }
                >
                  <SelectTrigger className="w-full" onBlur={field.onBlur}>
                    <SelectValue placeholder="Selecciona método">
                      {selectedDeliveryMethodLabel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Todos</SelectItem>
                      {deliveryMethodOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        <Field>
          <FieldLabel>Correo cliente</FieldLabel>
          <Input
            type="email"
            placeholder="correo@dominio.com"
            {...form.register("email")}
          />
        </Field>

        <Field>
          <FieldLabel>Fecha desde</FieldLabel>
          <Input type="datetime-local" {...form.register("createdAfter")} />
        </Field>

        <Field>
          <FieldLabel>Fecha hasta</FieldLabel>
          <Input type="datetime-local" {...form.register("createdBefore")} />
        </Field>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="outline" onClick={handleClear}>
          Limpiar filtros
        </Button>
        <Button type="submit" className="bg-blue-950">
          Aplicar filtros
        </Button>
      </div>
    </form>
  );
};
