import { useEffect, useState } from "react";
import { bannersService } from "@/api/services/banner.service";
import { CarouselItem } from "@/components/ui/carousel";
import type { Banner } from "@/types/banner.types";
import { getValidImageUrl } from "@/utils/imageHelper";

const BANNER_LIMIT = 10;

const Slides = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      try {
        const response = await bannersService.getAll(1, BANNER_LIMIT);

        if (isMounted) {
          setBanners(response.data.filter((banner) => banner.isActive));
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <CarouselItem className="basis-full">
        <div
          className="h-96 w-full animate-pulse rounded-md bg-muted"
          aria-label="Cargando banners"
        />
      </CarouselItem>
    );
  }

  if (hasError || banners.length === 0) {
    return null;
  }

  return (
    <>
      {banners.map((banner) => (
        <CarouselItem key={banner.id} className="basis-full">
          <div
            className="h-96 flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: `url('/banners-home/food-pattern.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/80" />
            <img
              src={getValidImageUrl(banner.imageUrl)}
              alt={banner.description || banner.name}
              className="relative z-10 h-full w-full object-contain"
              style={{ mixBlendMode: "darken" }}
            />
          </div>
        </CarouselItem>
      ))}
    </>
  );
};

export default Slides;
