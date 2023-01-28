import Image from "next/image";
import { useRef } from "react";
import type SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { NavigationOptions } from "swiper/types/modules/navigation";

// external imports
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const heroImages = [
  { src: "/img/hero-carousel-one.webp", alt: "hero-carousel-one" },
  { src: "/img/hero-carousel-two.webp", alt: "hero-carousel-two" },
  { src: "/img/hero-carousel-three.webp", alt: "hero-carousel-three" },
  { src: "/img/hero-carousel-four.webp", alt: "hero-carousel-four" },
  { src: "/img/hero-carousel-five.webp", alt: "hero-carousel-five" },
  { src: "/img/hero-carousel-six.webp", alt: "hero-carousel-six" },
];

const Hero = () => {
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const onBeforeInit = (swiper: SwiperCore) => {
    (swiper.params.navigation as NavigationOptions).prevEl =
      leftArrowRef.current;
    (swiper.params.navigation as NavigationOptions).nextEl =
      rightArrowRef.current;
  };

  return (
    <section
      aria-label="hero carousel"
      className="relative mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]"
    >
      <div className="absolute bottom-0 z-20 hidden h-32 w-full bg-gradient-to-t from-bg-gray to-transparent md:block" />
      <button
        aria-label="navigate to right"
        className="absolute left-0 z-20 mx-4 hidden h-full px-2 hover:ring-2 hover:ring-lowkey focus:ring-2 focus:ring-lowkey md:block"
        ref={leftArrowRef}
      >
        <ChevronLeftIcon
          className="aspect-square w-12 stroke-1 text-text"
          aria-hidden="true"
        />
      </button>
      <button
        aria-label="navigate to left"
        className="absolute right-0 z-20 mx-4 hidden h-full px-2 hover:ring-2 hover:ring-lowkey focus:ring-2 focus:ring-lowkey md:block"
        ref={rightArrowRef}
      >
        <ChevronRightIcon
          className="aspect-square w-12 stroke-1 text-text"
          aria-hidden="true"
        />
      </button>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: leftArrowRef.current,
          nextEl: rightArrowRef.current,
        }}
        onBeforeInit={onBeforeInit}
        modules={[Autoplay, Navigation]}
        className="h-full w-full md:h-60"
      >
        {heroImages.map((image) => (
          <SwiperSlide key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              width={1536}
              height={614}
              className="object-contain"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
