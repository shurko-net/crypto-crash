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
    const topPosition = isLong ? "-32%" : "12%";

    return (
      <div className={`absolute z-3 h-auto`} style={{ top: topPosition }} ref={carRef}>
        <Image alt={`${type}-car`} layout="responsive" src={carImage} />
        <div className="absolute top-[73%] left-[11.58%]">
          <Image
            alt={`${type}-wheel-front`}
            src={wheelImage}
            className={isAnimating ? "animate-rotate-wheel" : ""}
            layout="responsive"
          />
        </div>
        <div className="absolute top-[73%] left-[64.68%]">
          <Image
            alt={`${type}-wheel-back`}
            src={wheelImage}
            className={isAnimating ? "animate-rotate-wheel" : ""}
            layout="responsive"
          />
        </div>
      </div>
    );
  },
);

Car.displayName = "Car";
