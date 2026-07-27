import { ProductCard } from "../Product/ProductCard";
import { products } from "../Products-Category";

export default function NewOffers() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
          Nuevas Ofertas
        </h2>
      </div>
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
    </div>
  );
}
