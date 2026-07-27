import { z } from "zod";
import { TaskPriority, TaskStatus } from "../types/task.types";

const requiredUuid = z
  .string({ error: "El usuario asignado es requerido" })
  .uuid("El ID del usuario debe ser un UUID valido")
  .min(1, "El usuario asignado es requerido");

export const createTaskSchema = z.object({
  name: z
    .string({ error: "El nombre de la tarea es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  projectId: z.string({ error: "El proyecto es requerido" }),
  assignedToId: requiredUuid,
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial();

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const updateTaskPrioritySchema = z.object({
  priority: z.nativeEnum(TaskPriority),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
