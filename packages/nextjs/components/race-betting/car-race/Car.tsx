import { memo } from "react";
import Image from "next/image";
import GreenCarImg from "~~/public/images/green-car.png";
import GreenWheelsImg from "~~/public/images/green-wheels.png";
import RedCarImg from "~~/public/images/red-car.png";
import RedWheelsImg from "~~/public/images/red-wheels.png";

export const Car = memo(
  ({
    type,
    isAnimating,
    carRef,
  }: {
    type: "long" | "short";
    isAnimating: boolean;
    carRef: React.RefObject<HTMLDivElement>;
  }) => {
    const isLong = type === "long";
    const carImage = isLong ? GreenCarImg : RedCarImg;
    const wheelImage = isLong ? GreenWheelsImg : RedWheelsImg;
    const topPosition = isLong ? "-32%" : "6%";

    return (
      <div className={`absolute z-3`} style={{ top: topPosition }} ref={carRef}>
        <div className="relative h-13 md:h-[106px] aspect-[190/106]">
          <Image
            alt={`${type}-car`}
            src={carImage}
            fill
            sizes="(min-width: 768px) 190px, 100px"
            className="object-contain"
            loading="lazy"
          />
        </div>
        <div className="absolute top-[73%] left-[11.58%] w-[23.09%]  aspect-square">
          <Image
            alt={`${type}-wheel-front`}
            src={wheelImage}
            fill
            sizes="(min-width: 768px) 44px, 22px"
            className={`object-contain ${isAnimating ? "animate-rotate-wheel" : ""}`}
            loading="lazy"
          />
        </div>
        <div className="absolute top-[73%] left-[64.68%] w-[23.09%] aspect-square">
          <Image
            alt={`${type}-wheel-back`}
            src={wheelImage}
            fill
            sizes="(min-width: 768px) 44px, 22px"
            className={isAnimating ? "animate-rotate-wheel" : ""}
            loading="lazy"
          />
        </div>
      </div>
    );
  },
);

Car.displayName = "Car";
