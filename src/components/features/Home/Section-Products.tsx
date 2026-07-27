import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { products } from "../Products-Category";
import { Product } from "@/types/show-product-by-category";
import { ProductCard } from "../Product/ProductCard";

const SectionProducts = () => {
  const defaultTab = "todos";

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Titulo de la seccion  */}
      <div className="flex justify-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
          Algunas de nuestras catagorias
        </h2>
      </div>

      {/* Tabs  */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="flex justify-center flex-wrap gap-2 bg-transparent mb-6">
          <TabsTrigger
            value="todos"
            className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="bebidas"
            className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
          >
            Bebidas
          </TabsTrigger>
          <TabsTrigger
            value="carnes"
            className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
          >
            Carnes
          </TabsTrigger>
          <TabsTrigger
            value="confituras"
            className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
          >
            Confituras
          </TabsTrigger>
        </TabsList>

        {/* Contenido de cada tab  */}
        {Object.entries(products).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((product: Product) => (
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SectionProducts;
