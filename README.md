# 🏎️ Crypto Crash

> A real-time prediction race game on Monad testnet - bet on a car, watch it race the live BTC price chart.

![Status](https://img.shields.io/badge/status-archived-lightgrey)
![Network](https://img.shields.io/badge/network-Monad%20Testnet-836EF9)
![License](https://img.shields.io/badge/license-MIT-blue)

> ⚠️ **Note:** Built and deployed on Monad testnet, now deprecated following the network's migration to mainnet. The live app no longer functions. This repo is kept as a portfolio reference - see screenshots/demo video below.

---

##  Preview


https://github.com/user-attachments/assets/be79d247-aed0-4827-b459-c8ff0b77bb69

---

##  What it does

Crypto Crash turns BTC price action into a 15-second real-time race:

1. Players pick a car and place a prediction bet
2. A live BTC price feed drives car movement on a real-time chart for 15 seconds
3. The car whose prediction was closest to the actual price movement wins
4. Bets settle on-chain via smart contract

The goal was to make watching crypto price movement feel like an actual game - fast rounds, visual feedback, and on-chain settlement.

---

##  Architecture

```
┌────────────┐     wagmi / viem      ┌──────────────────┐
│  Frontend  │ ───────────────────── │  Smart Contract  │
│  Next.js   │                       │  (Monad Testnet) │
└────────────┘                       └──────────────────┘
      │
      ├── RainbowKit      → wallet connection
      ├── SignalR         → live race state push
      ├── Zustand         → race/game state
      └── BTC price feed  → drives car position in real time

Smart contract repo: github.com/YOUR_USERNAME/crypto-crash-contracts
```

Bets are placed through a Solidity contract on Monad testnet. The frontend subscribes to a live BTC price feed via SignalR and animates each car's position on the chart in sync with price ticks over the 15-second round. Once the round ends, results are settled and resolved on-chain.

---

##  Tech Stack

| Layer       | Technology |
|-------------|------------|
| Framework   | Next.js 14 |
| Web3        | wagmi, viem, RainbowKit |
| Styling     | Tailwind CSS + DaisyUI |
| State       | Zustand |
| Real-time   | SignalR |
| Animation   | Framer Motion |
| Contracts   | Solidity (see [contracts repo](https://github.com/DmitryDatsko/crypto-crash-contract)) |

---

##  Getting Started

> ⚠️ Live BTC feed and contract calls will not work - Monad testnet is deprecated. For local code exploration only.

```bash
git clone https://github.com/shurko-net/crypto-crash.git
cd crypto-crash
yarn install
yarn dev
```

---

##  Status

Deployed and fully functional on Monad testnet during its active period. No longer operational following the network's mainnet migration. Preserved here to showcase real-time on-chain game design and live data visualization.

---

##  Author

Built by [Yaroslav](https://github.com/Yaroslavmyronov) — [Twitter/X](@yaro_dev)

