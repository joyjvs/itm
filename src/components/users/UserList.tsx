import { Edit2, Trash2 } from "lucide-react";
import IconActionButton from "../common/IconActionButton";
import Loader from "../common/Loader";
import type { User } from "../../types/auth.types";

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const getFullName = (user: User) =>
  [user.name, user.lastName].filter(Boolean).join(" ") || "Sin nombre";

const UserList = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
}: UserListProps) => {
  if (isLoading) {
    return <Loader message="Cargando usuarios..." />;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay usuarios para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
              Nombre
            </th>
            <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
              Email
            </th>
            <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
              ID
            </th>
            <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
              Fecha Creacion
            </th>
            <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="p-4 text-gray-900 dark:text-white">
                {getFullName(user)}
              </td>
              <td className="p-4 text-gray-500 dark:text-gray-400">
                {user.email}
              </td>
              <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                {user.id}
              </td>
              <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-1">
                  <IconActionButton
                    label="Editar"
                    variant="primary"
                    onClick={() => onEdit(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </IconActionButton>
                  <IconActionButton
                    label="Eliminar"
                    variant="destructive"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
