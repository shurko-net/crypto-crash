"use client";

import Link from "next/link";
import { LogoImage } from "./assets/LogoImage";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";

export const Header = () => {
  return (
    <header className="fixed lg:relative top-0 z-10  py-3.5 w-full ">
      <div className="absolute inset-x-0 top-0 pointer-events-none -bottom-3 max-lg:bg-[image:linear-gradient(#1c123f_20%,#1c123fa1_70%,#1c123f1f_90%,transparent)] -z-1"></div>
      <div className="container flex items-center justify-end">
        <div className="navbar-start w-auto lg:w-1/2">
          <Link href="/" passHref className="inline-flex items-center gap-2  shrink-0 ">
            <LogoImage />
          </Link>
        </div>
        <div className="navbar-end flex-grow flex">
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </header>
  );
};
