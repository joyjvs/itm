import { useTaskStore } from "../store/taskStore";

export const useTasks = () => {
  const {
    tasks,
    filteredTasks,
    statusFilter,
    priorityFilter,
    isLoading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    setStatusFilter,
    setPriorityFilter,
    setPage,
    setLimit,
    clearError,
  } = useTaskStore();

  return {
    tasks,
    filteredTasks,
    statusFilter,
    priorityFilter,
    isLoading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    setStatusFilter,
    setPriorityFilter,
    setPage,
    setLimit,
    clearError,
  };
};
