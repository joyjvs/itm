import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { usersService } from "../../api/services/users.service";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import ConfirmAlertDialog from "../../components/common/ConfirmAlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/common/Dialog";
import UserForm from "../../components/forms/UserForm";
import MainLayout from "../../components/layout/MainLayout";
import UserList from "../../components/users/UserList";
import type { User } from "../../types/auth.types";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const systemUsers = await usersService.getAll();
      setUsers(systemUsers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar usuarios",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    usersService
      .getAll()
      .then((systemUsers) => {
        if (isMounted) {
          setUsers(systemUsers);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar usuarios",
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDeleteId) return;
    setError(null);

    try {
      await usersService.delete(userToDeleteId);
      setUserToDeleteId(null);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el usuario",
      );
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground">
              Gestiona los usuarios registrados en el sistema
            </p>
          </div>

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <UserList
          users={users}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={setUserToDeleteId}
        />
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear usuario</DialogTitle>
            <DialogDescription>
              Completa los datos para registrar un usuario en el sistema
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              loadUsers();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Actualiza los datos principales del usuario
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editingUser}
            onSuccess={() => {
              setEditDialogOpen(false);
              setEditingUser(null);
              loadUsers();
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmAlertDialog
        open={!!userToDeleteId}
        onOpenChange={(open) => !open && setUserToDeleteId(null)}
        title="Eliminar usuario"
        description="Esta accion desactivara el usuario seleccionado. Deseas continuar?"
        confirmText="Eliminar usuario"
        onConfirm={confirmDeleteUser}
      />
    </MainLayout>
  );
};

export default UsersPage;
