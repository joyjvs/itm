import Loader from "../common/Loader";
import { Edit2, Trash2 } from "lucide-react";
import IconActionButton from "../common/IconActionButton";
import type { Task, TaskStatus, TaskPriority } from "../../types/task.types";

interface TaskTableProps {
  tasks: Task[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onPriorityChange?: (taskId: string, priority: TaskPriority) => void;
  canEditTask?: (task: Task) => boolean;
  canDeleteTask?: (task: Task) => boolean;
  canChangeStatus?: (task: Task) => boolean;
  canChangePriority?: (task: Task) => boolean;
}

const TaskTable = ({
  tasks,
  pagination,
  onPageChange,
  onLimitChange,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  canEditTask = () => true,
  canDeleteTask = () => true,
  canChangeStatus = () => true,
  canChangePriority = () => true,
}: TaskTableProps) => {
  if (isLoading) {
    return <Loader message="Cargando tareas..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay tareas por mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Nombre
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Estado
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Prioridad
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                Asignado a
              </th>
              <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-4 text-gray-900 dark:text-white">
                  {task.name}
                </td>
                <td className="p-4">
                  {onStatusChange && canChangeStatus(task) ? (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        onStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {task.status === "completed"
                        ? "Completada"
                        : task.status === "in_progress"
                          ? "En progreso"
                          : "Pendiente"}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {onPriorityChange && canChangePriority(task) ? (
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        onPriorityChange(
                          task.id,
                          e.target.value as TaskPriority,
                        )
                      }
                      className="px-2 py-1 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {task.priority === "high"
                        ? "Alta"
                        : task.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {task.assignedTo ? (
                    <span className="text-sm text-gray-900 dark:text-gray-200">
                      {task.assignedTo.name} {task.assignedTo.lastName}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Sin asignar
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    {canEditTask(task) && (
                      <IconActionButton
                        label="Editar"
                        variant="primary"
                        onClick={() => onEdit(task)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </IconActionButton>
                    )}
                    {canDeleteTask(task) && (
                      <IconActionButton
                        label="Eliminar"
                        variant="destructive"
                        onClick={() => onDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconActionButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mostrar
          </span>
          <select
            value={pagination.itemsPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            por página
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Página {pagination.currentPage} de {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === (pagination.totalPages || 1)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
