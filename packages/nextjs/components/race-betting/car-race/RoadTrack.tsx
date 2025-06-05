import { memo } from "react";
import Image from "next/image";
import Road from "~~/public/images/road.png";

export const RoadTrack = memo(({ isAnimating }: { isAnimating: boolean }) => (
  <div className={`flex h-full w-[1736px] ${isAnimating ? "animate-move-road" : ""}`}>
    <div className="relative w-full max-w-[818px] h-20 md:h-[154px] lg:h-[166px] aspect-[818/154]">
      <Image
        alt="road"
        src={Road}
        fill
        sizes="(min-width: 1024px) 868px, (min-width: 768px) 640px, 320px"
        className="object-contain"
        loading="lazy"
      />
    </div>
    <div className="relative h-20 md:h-[154px] lg:h-[166px] aspect-[868/209]">
      <Image
        alt="road"
        src={Road}
        fill
        sizes="(min-width: 1024px) 868px, (min-width: 768px) 640px, 320px"
        className="object-contain"
        loading="lazy"
      />
    </div>
  </div>
));

RoadTrack.displayName = "RoadTrack";
