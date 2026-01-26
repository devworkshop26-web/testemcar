import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminEntityField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

interface AdminEntityFormProps<TValues extends Record<string, any>> {
  defaultValues?: Partial<TValues>;
  fields: AdminEntityField[];
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: TValues) => Promise<void> | void;
}

export function AdminEntityForm<TValues extends Record<string, any>>({
  defaultValues,
  fields,
  submitLabel,
  isSubmitting,
  onSubmit,
}: AdminEntityFormProps<TValues>) {
  const initialValues = useMemo(() => {
    const base: Record<string, string> = {};
    fields.forEach((field) => {
      base[field.name] = (defaultValues?.[field.name] as string) ?? "";
    });
    return base as Record<string, any> as TValues;
  }, [defaultValues, fields]);

  const [values, setValues] = useState<TValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3">
        {fields.map((field) => (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              type={field.type ?? "text"}
              required={field.required}
              value={(values as Record<string, any>)[field.name] ?? ""}
              disabled={isSubmitting}
              onChange={(event) =>
                setValues((prev) => ({
                  ...(prev as Record<string, any>),
                  [field.name]: event.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
