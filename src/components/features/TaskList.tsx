import TaskCard from './TaskCard';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import type { Task } from '../../types/task.types';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  emptyMessage?: string;
}

const TaskList = ({
  tasks,
  isLoading,
  error,
  onEdit,
  onDelete,
  emptyMessage = 'No hay tareas por mostrar',
}: TaskListProps) => {
  if (isLoading) {
    return <Loader message="Cargando tareas..." />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        {error}
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;