import Image from "next/image";
import Logo from "~~/public/images/logo.png";

export const LogoImage = () => {
  return (
    <div className="relative w-28 xs:w-30 lg:w-36 hd:w-40 aspect-[183/35]">
      <Image
        alt="logo"
        src={Logo}
        fill
        sizes="(max-width: 475px) 7.5rem, (max-width: 1024px) 9rem, (max-width: 1720px) 10rem, 7rem"
        className="cursor-pointer object-contain"
      />
    </div>
  );
};
