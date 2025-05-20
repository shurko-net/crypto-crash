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
import { WagmiProvider } from "wagmi";
import { Header } from "~~/components/Header";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
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
        const response = await fetch("https://localhost:7013/api/auth/me");
        const json = await response.json();
        console.log(json);
        setAuthStatus(json.address ? "authenticated" : "unauthenticated");
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
  }, [setAuthStatus]);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch("https://localhost:7013/api/auth/nonce");
        return await response.text();
      },

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
          const response = await fetch("https://localhost:7013/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
          });

          const authenticated = Boolean(response.ok);

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
        await fetch("https://localhost:7013/api/auth/logout");
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
