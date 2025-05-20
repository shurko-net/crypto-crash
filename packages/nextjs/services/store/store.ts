import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

type GlobalState = {
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  authStatus: AuthenticationStatus;
  setAuthStatus: (newStatus: AuthenticationStatus) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  authStatus: "loading",
  setAuthStatus: (newStatus: AuthenticationStatus) => set(() => ({ authStatus: newStatus })),
}));
