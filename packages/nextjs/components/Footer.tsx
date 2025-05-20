import Image from "next/image";
import Link from "next/link";
import Logo from "~~/public/images/logo.png";

export const Footer = () => {
  return (
    <footer className="mx-auto mt-auto pb-6 pt-5 md:pt-10 w-full ">
      <div className="container">
        <div className="">
          <div className="mb-4 lg:mb-6 flex-wrap flex items-center gap-1.5">
            <Link href="/" passHref className="inline-flex items-center gap-2  shrink-0 mr-auto">
              <Image layout="responsive" alt="logo" className="cursor-pointer" src={Logo} />
            </Link>
          </div>
          <div className="flex flex-wrap items-end justify-between relative">
            <div>
              <div className="mb-4 lg:mb-3 flex text-sm sm:text-inherit items-center gap-2.5">
                <div className="flex aspect-square w-9 shrink-0 items-center justify-center rounded-xl bg-[#9cc8ff]/10 text-sm font-bold ">
                  18+
                </div>
                <div className="text-sm font-medium">CRYPTOCRASH © {new Date().getFullYear()} </div>
              </div>
            </div>
            <nav className="mr-auto w-full">
              <ul className="-mx-2 flex items-center flex-wrap gap-1 sm:gap-x-1.5 text-sm text-white">
                <li>
                  <Link className="block px-2 py-1 transition-colors hover:text-skyBlue" href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="block px-2 py-1 transition-colors hover:text-skyBlue" href="/terms">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link className="block px-2 py-1 transition-colors hover:text-skyBlue" href="/privacy">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link className="block px-2 py-1 transition-colors hover:text-skyBlue" href="/faq">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="block px-2 py-1 transition-colors hover:text-skyBlue" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
