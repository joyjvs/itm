import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { slides } from "../Slides";

const BannerHome = () => {

  return (
    <Carousel className="w-full px-12">
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
              {/* Overlay para que la imagen principal se vea mejor */}
              <div className="absolute inset-0 bg-white/80"></div>

              {/* <div className="h-96 flex items-center justify-center"> */}
              <img
                src={src.image}
                alt={src.alt}
                //className="w-full h-full object-contain"
                className="relative z-10 w-full h-full object-contain"
                style={{ mixBlendMode: "darken" }}
              />
              {/* </div> */}
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
