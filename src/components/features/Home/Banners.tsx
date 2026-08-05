import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { slides } from "../Slides";

const BannerHome = () => {
  return (
    <Carousel
      className="w-full px-12"
      opts={{
        loop: true, // 👈 Para que vuelva al primer slide al llegar al final
      }}
      plugins={[
        Autoplay({
          delay: 3500, // 👈 Tiempo entre slides en ms (4 segundos)
          stopOnInteraction: false, // 👈 Permite usar flechas y retoma el autoplay
          stopOnMouseEnter: true, // 👈 Pausa cuando el usuario pasa el mouse
        }),
      ]}
    >
      <CarouselContent>
        {slides.map((src, index) => (
          <CarouselItem key={index} className="basis-full">
            <div
              className="h-96 flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundImage: `url('/banners-home/food-pattern.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/80"></div>
              <img
                src={src.image}
                alt={src.alt}
                className="relative z-10 w-full h-full object-contain"
                style={{ mixBlendMode: "darken" }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default BannerHome;
