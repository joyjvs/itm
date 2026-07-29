import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Páginas de Autenticación
import RegisterPage from "@/pages/Auth/RegisterPage";
import LoginPage from "@/pages/Auth/LoginPage";
import ProfilePage from "@/pages/Auth/Profile";

// Páginas Principales
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/Home/HomePage";

import AllProducts from "@/pages/Products/AllProducts";
import ProductDetails from "@/pages/Products/ProductDetails";
import About from "@/pages/About/AboutPage";
import CartPage from "@/pages/Cart/CartPage";
import ChangePasswordPage from "@/pages/Auth/ChangePasswordPage";
import OrdersPage from "@/pages/Orders/OrdersPage";
import OrderDetailPage from "@/pages/Orders/OrderDetailPage";
import { SubcategoriesPage } from "@/pages/Admin/Subcategories";
import { ProductsPage } from "@/pages/Admin/Product/Products";
import { UsersPageAdmin } from "@/pages/Admin/User/Users";
import { OrdersPageAdmin } from "@/pages/Admin/Orders";
import CategoriesPage from "@/pages/Admin/Category/Categories";

// Componente para proteger rutas
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente para rutas públicas (redirige si está autenticado)
// interface PublicRouteProps {
//   children: React.ReactNode;
// }

// const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

function RoutesComponents() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Rutas Protegidas */}
        {/* <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/*Rutas para usuarios administradores de la tienda  */}
        <Route
          path="/categories-admin"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subcategories-admin"
          element={
            <ProtectedRoute>
              <SubcategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products-admin"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders-admin"
          element={
            <ProtectedRoute>
              <OrdersPageAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users-admin"
          element={
            <ProtectedRoute>
              <UsersPageAdmin />
            </ProtectedRoute>
          }
        />

        {/* Rutas Especiales */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default RoutesComponents;
