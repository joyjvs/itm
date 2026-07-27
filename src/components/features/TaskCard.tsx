import { useState } from "react";
import { Trash2, Edit2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common/Card";
import Button from "../common/Button";
import ConfirmAlertDialog from "../common/ConfirmAlertDialog";
import Select from "../common/Select";
import { type Task, TaskStatus, TaskPriority } from "../../types/task.types";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";
import cn from "../../utils/cn";
import { formatOptionalText } from "../../utils/displayText";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const { user } = useAuth();
  const { updateTaskStatus, updateTaskPriority, deleteTask, isLoading } =
    useTasks();
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const description = formatOptionalText(task.description, "");

  const statusIcons = {
    [TaskStatus.PENDING]: <Clock className="h-4 w-4" />,
    [TaskStatus.IN_PROGRESS]: <AlertCircle className="h-4 w-4" />,
    [TaskStatus.COMPLETED]: <CheckCircle className="h-4 w-4" />,
  };

  const statusLabels = {
    [TaskStatus.PENDING]: "Pendiente",
    [TaskStatus.IN_PROGRESS]: "En Progreso",
    [TaskStatus.COMPLETED]: "Completada",
  };

  const priorityColors = {
    [TaskPriority.LOW]: "text-green-600",
    [TaskPriority.MEDIUM]: "text-yellow-600",
    [TaskPriority.HIGH]: "text-red-600",
  };

  const priorityLabels = {
    [TaskPriority.LOW]: "Baja",
    [TaskPriority.MEDIUM]: "Media",
    [TaskPriority.HIGH]: "Alta",
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (user?.id) {
      await updateTaskStatus(user.id, task.id, newStatus);
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (user?.id) {
      await updateTaskPriority(user.id, task.id, newPriority);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;
    setDeleting(true);
    try {
      await deleteTask(user.id, task.id);
      onDelete?.(task);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.name}</CardTitle>
            <CardDescription>{task.project.name}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(task)}
              aria-label="Editar"
              title="Editar"
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting || isLoading}
              aria-label="Eliminar"
              title="Eliminar"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Estado
            </label>
            <div className="flex items-center gap-2">
              {statusIcons[task.status]}
              <Select
                options={[
                  {
                    value: TaskStatus.PENDING,
                    label: statusLabels[TaskStatus.PENDING],
                  },
                  {
                    value: TaskStatus.IN_PROGRESS,
                    label: statusLabels[TaskStatus.IN_PROGRESS],
                  },
                  {
                    value: TaskStatus.COMPLETED,
                    label: statusLabels[TaskStatus.COMPLETED],
                  },
                ]}
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as TaskStatus)
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Prioridad
            </label>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-3 w-3 rounded-full",
                  priorityColors[task.priority],
                )}
              />
              <Select
                options={[
                  {
                    value: TaskPriority.LOW,
                    label: priorityLabels[TaskPriority.LOW],
                  },
                  {
                    value: TaskPriority.MEDIUM,
                    label: priorityLabels[TaskPriority.MEDIUM],
                  },
                  {
                    value: TaskPriority.HIGH,
                    label: priorityLabels[TaskPriority.HIGH],
                  },
                ]}
                value={task.priority}
                onChange={(e) =>
                  handlePriorityChange(e.target.value as TaskPriority)
                }
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {task.assignedTo && (
          <div className="pt-2 border-t">
            <label className="text-xs font-medium text-muted-foreground">
              Asignado a
            </label>
            <p className="text-sm text-foreground mt-1">
              {task.assignedTo.name} {task.assignedTo.lastName}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Creada: {new Date(task.createdAt).toLocaleDateString("es-ES")}
        </div>
      </CardContent>

      <ConfirmAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar tarea"
        description="Esta accion eliminara la tarea seleccionada. Deseas continuar?"
        confirmText="Eliminar tarea"
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default TaskCard;
