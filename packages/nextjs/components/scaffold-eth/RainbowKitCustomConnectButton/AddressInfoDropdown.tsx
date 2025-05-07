import { useRef, useState } from "react";
import { isENS } from "..";
import CopyToClipboard from "react-copy-to-clipboard";
import { Address, getAddress } from "viem";
import { useDisconnect } from "wagmi";
import { ArrowRightEndOnRectangleIcon, CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { BlockieAvatar } from "~~/components/BlockieAvatar";
import { Modal } from "~~/components/Modal";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({ address, ensAvatar, displayName }: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const checkSumAddress = getAddress(address);

  const [addressCopied, setAddressCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="button !py-[0.5rem] !px-[0.75rem] text-[0.75rem] !border-[0.125rem] lg:!px-7 lg:!py-3 lg:!border-[0.3125rem] lg:!text-[1rem]"
      >
        <span className="">
          {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
        </span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-wrap gap-3 items-center p-6">
          <BlockieAvatar address={checkSumAddress} size={48} ensImage={ensAvatar} />

          <div className="flex items-center gap-1.5">
            <span className="">
              {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
            </span>
            {addressCopied ? (
              <div className="btn-sm !rounded-xl flex gap-3 py-3">
                <CheckCircleIcon
                  className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <div className="btn-sm !rounded-xl flex gap-3 py-3">
                  <DocumentDuplicateIcon
                    className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                    aria-hidden="true"
                  />
                </div>
              </CopyToClipboard>
            )}
          </div>
        </div>
        <div className="px-4 border-t border-gray-300">
          <button
            className="bg-transparent box-border flex items-center w-full cursor-pointer text-base font-medium text-[#7c7a85] tap-transparent leading-[1.3] p-3 rounded-lg gap-3 transition-colors transition-transform duration-200"
            type="button"
            onClick={() => disconnect()}
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6 ml-2 sm:ml-0" />{" "}
            <span className="text-[1rem] text-white font-medium text-left">Disconnect</span>
          </button>
        </div>
      </Modal>
      {/* <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        <summary className="button !py-[0.5rem] !px-[0.75rem] text-[0.75rem] !border-[0.125rem] lg:!px-7 lg:!py-3 lg:!border-[0.3125rem] lg:!text-[1rem]">
          <span className="">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
        </summary>
        <ul className="dropdown-content menu w-full z-[2] p-2 mt-2  bg-base-200 rounded-box gap-1">
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? "hidden" : ""}>
            {addressCopied ? (
              <div className="btn-sm !rounded-xl flex gap-3 py-3">
                <CheckCircleIcon
                  className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                  aria-hidden="true"
                />
                <span className=" whitespace-nowrap">Copy address</span>
              </div>
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <div className="btn-sm !rounded-xl flex gap-3 py-3">
                  <DocumentDuplicateIcon
                    className="text-xl font-normal h-6 w-4 cursor-pointer ml-2 sm:ml-0"
                    aria-hidden="true"
                  />
                  <span className=" whitespace-nowrap">Copy address</span>
                </div>
              </CopyToClipboard>
            )}
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <label htmlFor="qrcode-modal" className="btn-sm !rounded-xl flex gap-3 py-3">
              <QrCodeIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <span className="whitespace-nowrap">View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? "hidden" : ""}>
            <button className="menu-item btn-sm !rounded-xl flex gap-3 py-3" type="button">
              <ArrowTopRightOnSquareIcon className="h-6 w-4 ml-2 sm:ml-0" />
              <a
                target="_blank"
                href={blockExplorerAddressLink}
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
                View on Block Explorer
              </a>
            </button>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="btn-sm !rounded-xl flex gap-3 py-3"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
              type="button"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details> */}
    </>
  );
};
