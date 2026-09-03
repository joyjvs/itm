import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Slides from "../Slides";

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
          playOnInit: true,
          stopOnInteraction: false, // 👈 Permite usar flechas y retoma el autoplay
          stopOnMouseEnter: true, // 👈 Pausa cuando el usuario pasa el mouse
        }),
      ]}
    >
      <CarouselContent>
        <Slides />
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default BannerHome;
