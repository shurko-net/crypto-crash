"use client";

// @refresh reset
import { useEffect } from "react";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { getBlockExplorerAddressLink, getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

const monadNetwork =
  allowedNetworks.find(network => network.name.toLowerCase().includes("monad")) || allowedNetworks[0];

export const RainbowKitCustomConnectButton = () => {
  const { switchChain } = useSwitchChain();
  const { targetNetwork } = useTargetNetwork();
  const authStatus = useGlobalState(({ authStatus }) => authStatus);
  const { chain, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && chain && chain.id !== monadNetwork.id && switchChain) {
      switchChain({ chainId: monadNetwork.id });
    }
  }, [isConnected, chain, switchChain]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (authStatus === "loading") {
                return (
                  <button
                    className="button !py-[0.5rem] !px-[0.75rem] text-[0.75rem] !border-[0.125rem] lg:!px-7 lg:!py-3 lg:!border-[0.3125rem] lg:!text-[1rem] leading-3"
                    type="button"
                  >
                    <div className="line-skeleton w-[5.67rem] h-[1.125rem] md:h-6 md:w-[7.56rem] !rounded-none !bg-navyBlue"></div>
                  </button>
                );
              }
              if (authStatus === "unauthenticated" || !connected) {
                return (
                  <button
                    className="button !py-[0.6875rem] !px-[1.7441rem] text-[0.75rem] !border-[0.125rem] lg:!px-[3.0756rem] lg:!py-[1.125rem] lg:!border-[0.3125rem] lg:!text-[1rem] leading-3"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect
                  </button>
                );
              }

              if (chain?.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
