export const PlayerBets = () => {
  return (
    <section className="pt-2 order-2">
      <div className="mb-4">
        <h2 className="title z-3 relative">Players Bets</h2>
      </div>
      <ul>
        <li className="h-18 sm:h-21">
          <div className="relative z-1 flex h-16 items-center gap-3 overflow-hidden rounded bg-[#1c233a]  bg-gradient-var-to-r pl-3 [--to:#232c4833] sm:h-20 sm:pl-4 lg:rounded-2xl">
            <div className="mr-auto flex items-center gap-3 sm:gap-4.5">
              <div className="block aspect-square h-fit shrink-0 w-10 sm:w-11.5">
                <div className="mb-0.5 font-medium max-md:sr-only">jeff</div>
                <div className="text-sm font-semibold text-[#ffc6b0] sm:text-base">4.26$</div>
              </div>
              <div></div>
            </div>
            <div className="flex h-full items-center gap-3 overflow-hidden ">
              <div className="relative z-1 flex h-full items-center gap-4  pr-3  sm:pr-4 ">
                <div className=" flex items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-[#323e60] px-3 py-1.5 text-xs font-semibold uppercase bg-[#2a345480] text-[#d6e2ff] sm:min-w-16.5 ">
                  In Game
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};
