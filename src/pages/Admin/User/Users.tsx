import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUser";
import { usersService } from "@/api/services/users.service";
import { UserModal } from "@/components/user/UserModal";
import type { User } from "@/types/user.types";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

export const UsersPageAdmin = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleDeleteRequest = (userId: string) => {
    setUserIdToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userIdToDelete) return;

    setDeletingUserId(userIdToDelete);

    try {
      await usersService.delete(userIdToDelete);
      await fetchUsers();
    } catch (err) {
      console.error("No se pudo eliminar el usuario", err);
    } finally {
      setDeletingUserId(null);
      setDeleteDialogOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Usuarios</h1>
            <p className="text-sm text-muted-foreground">
              Gestión de usuarios del panel administrativo.
            </p>
            <Button onClick={handleCreate}>+ Nuevo Usuario</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Cargando usuarios...
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            No hay usuarios registrados.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const roleName =
                  user.roles?.[0]?.name ?? user.role ?? "Sin rol";

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{roleName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRequest(user.id)}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <UserModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          user={selectedUser}
          onSuccess={fetchUsers}
        />

        <ConfirmAlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Eliminar usuario"
          description="Esta acción eliminará el usuario seleccionado. ¿Deseas continuar?"
          confirmText="Eliminar usuario"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
};
