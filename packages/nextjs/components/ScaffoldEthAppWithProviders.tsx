"use client";

import { useEffect, useMemo, useRef } from "react";
import { Footer } from "./Footer";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  createAuthenticationAdapter,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createSiweMessage } from "viem/siwe";
import { WagmiProvider, useAccount, useSwitchChain } from "wagmi";
import { Header } from "~~/components/Header";
import { authApi } from "~~/services/api/authApi";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const { address, chain, isConnected } = useAccount();
  const previousAddress = useRef<string | undefined>();
  const allowedNetworks = getTargetNetworks();
  const { switchChain } = useSwitchChain();

  const monadNetwork =
    allowedNetworks.find(network => network.name.toLowerCase().includes("monad")) || allowedNetworks[0];
  const setAuthStatus = useGlobalState(({ setAuthStatus }) => setAuthStatus);

  // useEffect(() => {
  //   if (!isConnected || (previousAddress.current && address !== previousAddress.current)) {
  //     setAuthStatus("unauthenticated");
  //     try {
  //       console.log("success1");
  //     } catch (error) {
  //       console.error("Logout error:", error);
  //     }
  //     console.warn("The address has been changed");
  //   }
  //   previousAddress.current = address;
  // }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && chain && chain.id !== monadNetwork.id && switchChain) {
      switchChain({ chainId: monadNetwork.id });
    }
  }, [isConnected, chain, switchChain, monadNetwork.id]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative z-0 flex flex-col flex-1 ">{children}</main>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const authStatus = useGlobalState(({ authStatus }) => authStatus);
  const setAuthStatus = useGlobalState(({ setAuthStatus }) => setAuthStatus);
  const addressRef = useRef<string | undefined>();

  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const data = await authApi.getMe();
        setAuthStatus(data.address ? "authenticated" : "unauthenticated");
      } catch (_error) {
        console.error(_error);
        setAuthStatus("unauthenticated");
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    fetchStatus();

    window.addEventListener("focus", fetchStatus);
    return () => window.removeEventListener("focus", fetchStatus);
  }, []);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: () => authApi.getNonce(),
      createMessage: ({ nonce, address, chainId }) => {
        console.log("address", address);
        addressRef.current = address;
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Monad to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },
      verify: async ({ message, signature }) => {
        verifyingRef.current = true;

        try {
          const data = await authApi.verify(message, signature);
          const authenticated = Boolean(data);
          console.log(authenticated);
          if (authenticated) {
            setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
          }

          return authenticated;
        } catch (error) {
          console.error("Error verifying signature", error);
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        setAuthStatus("unauthenticated");
        try {
          console.log("success2");
          authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    });
  }, [setAuthStatus]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider status={authStatus} adapter={authenticationAdapter}>
          <RainbowKitProvider
            theme={darkTheme({
              ...darkTheme.accentColors.purple,
            })}
          >
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
