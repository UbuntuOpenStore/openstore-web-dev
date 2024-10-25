import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { DiscoverData } from "@/schema";

const HighlightedApps = ({ highlights }: { highlights: DiscoverData["highlights"] }) => {
  return (
    <Carousel>
      <CarouselContent>
        {
          highlights.map((highlight, index) => (
            <CarouselItem>
              <div className="relative">
                <a href={`/app/${highlight.id}`}>
                  <img src={highlight.image} alt={highlight.app.name} className="rounded-2xl" loading={index === 0 ? "eager" : "lazy"} />
                </a>
                <div className="absolute bottom-0 left-0 bg-black/50 text-white rounded-2xl p-4">
                  <a href={`/app/${highlight.id}`} className="text-xl underline">
                    {highlight.app.name}
                  </a>
                  <p>{highlight.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default HighlightedApps;
