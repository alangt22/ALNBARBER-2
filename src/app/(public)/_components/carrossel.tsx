"use client";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Scissors,
  Syringe,
  CarTaxiFront,
  Hotel,
  Clock,
} from "lucide-react";
import Img1 from "../../../../public/agenda1.png";
import Img2 from "../../../../public/agenda2.png";
import Image from "next/image";

const images = [Img1, Img2];

export function Carrossel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }
  function scrollNext() {
    emblaApi?.scrollNext();
  }

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto py-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((item, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0  px-3"
                  data-aos="zoom-in"
                  data-aos-offset="200"
                >
                  <article className="">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-full h-[520px]">
                        <Image
                          src={item}
                          alt="Fotos do site"
                          fill
                          quality={100}
                          className="object-fill"
                        />
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-white flex items-center justify-center rounded-full shadow-lg w-10 h-10 absolute left-3 -translate-y-1/2 
                    -translate-x-1/2 top-1/2 z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            className="bg-white flex items-center justify-center rounded-full shadow-lg w-10 h-10 absolute -right-6 -translate-y-1/2 
                    -translate-x-1/2 top-1/2 z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
