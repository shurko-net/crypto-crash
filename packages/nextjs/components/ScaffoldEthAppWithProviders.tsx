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

interface ScaffoldEthAppProps {
  children: React.ReactNode;
  authStatus: "authenticated" | "unauthenticated" | "loading";
  setAuthStatus: (status: "authenticated" | "unauthenticated" | "loading") => void;
}

const ScaffoldEthApp = ({ children }: ScaffoldEthAppProps) => {
  const { chain, isConnected } = useAccount();
  const allowedNetworks = getTargetNetworks();
  const { switchChain } = useSwitchChain();

  const monadNetwork =
    allowedNetworks.find(network => network.name.toLowerCase().includes("monad")) || allowedNetworks[0];

  //  useEffect(() => {
  //  if (!address && authStatus === "authenticated") {
  //   setAuthStatus("unauthenticated");
  // }
  // }, [address, authStatus, setAuthStatus]);

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
        const jwtOk = !!data.address;

        const accounts = await window.ethereum?.request({ method: "eth_accounts" });
        const walletOk = Array.isArray(accounts) && accounts.length > 0;

        if (jwtOk) {
          if (walletOk) {
            setAuthStatus("authenticated");
          } else {
            setAuthStatus("unauthenticated");
          }
        } else {
          // JWT невалиден — вызываем logout
          await authApi.logout();
          setAuthStatus("unauthenticated");
          console.log("Clean JWT cookie because JWT invalid");
        }
      } catch (error) {
        console.error(error);
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
            <ScaffoldEthApp authStatus={authStatus} setAuthStatus={setAuthStatus}>
              {children}
            </ScaffoldEthApp>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
