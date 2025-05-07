import { memo } from "react";
import Image from "next/image";
import Road from "~~/public/images/road.png";

export const RoadTrack = memo(({ isAnimating }: { isAnimating: boolean }) => (
  <div className={`flex h-full w-[1736px] ${isAnimating ? "animate-move-road" : ""}`}>
    <Image src={Road} alt="road" loading="lazy" layout="responsive" />
    <Image src={Road} alt="road" loading="lazy" layout="responsive" />
  </div>
));

RoadTrack.displayName = "RoadTrack";
