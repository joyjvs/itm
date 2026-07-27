import MainLayout from "@/components/layout/MainLayout";
import { products } from "@/components/features/Products-Category";
import { ProductCard } from "@/components/features/Product/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";

const AllProducts = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-8">
          <ProductFilters/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.bebidas.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        <div className="mt-10"></div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.carnes.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        <div className="mt-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.confituras.map((product) => (
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllProducts;
