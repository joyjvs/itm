import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({ error: "El nombre del proyecto es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripcion no puede exceder 500 caracteres")
    .optional(),
  archived: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
