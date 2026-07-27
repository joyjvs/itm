import { useState } from 'react';
import { Trash2, Edit2, Users, CheckCircle, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/Card';
import Button from '../common/Button';
import ConfirmAlertDialog from '../common/ConfirmAlertDialog';
import type { Project } from '../../types/project.types';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../common/Dialog';
import TaskForm from '../forms/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { formatOptionalText } from '@/utils/displayText';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteProject, isLoading } = useProjects();
  const [deleting, setDeleting] = useState(false);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {fetchTasks } = useTasks()

  const isOwner = project.ownerId === user?.id;

  const handleViewTasks = () => {
    // Navega a la pagina de tareas, pasando el ID del proyecto
    navigate(`/tasks/${project.id}`);
    // O a un modal, etc.
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!user?.id) return;
    setDeleting(true);
    try {
      await deleteProject(user.id, project.id);
      onDelete?.(project);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {formatOptionalText(project.description, "Sin descripcion")}
              </CardDescription>
            </div>
            {isOwner && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(project)}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleViewTasks}
                  aria-label="Ver tareas"
                  title="Ver tareas"
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddTask}
                  aria-label="Agregar tarea"
                  title="Agregar tarea"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {/* <span>{project.members.length} miembro(s)</span> */}
          </div>

          {project._count && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>{project._count.tasks} tarea(s)</span>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {project.archived ? "Archivado" : "Activo"}
          </div>
        </CardContent>
      </Card>

      {/* New Task Dialog */}
      <Dialog
        open={isOpenModal}
        onOpenChange={(open) =>
          setIsModalOpen(open)
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogDescription>
              Completa los detalles para crear una nueva tarea
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSuccess={() => {
              setIsModalOpen(false);
              if (user?.id && project.id) fetchTasks(user.id, project.id);
            }}
            projectId={project.id}
          />
        </DialogContent>
      </Dialog>

      <ConfirmAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar proyecto"
        description="Esta accion eliminara el proyecto y sus tareas asociadas. Deseas continuar?"
        confirmText="Eliminar proyecto"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ProjectCard;
