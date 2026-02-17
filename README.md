# Delegation Playground

An interactive visualization tool for the MetaMask Delegation Framework. Create, explore, and simulate delegations with real blockchain integration.

![Delegation Playground](https://img.shields.io/badge/MetaMask-Delegation%20Framework-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)

## Features

- 🔗 **Wallet Connection** - Connect with MetaMask or any RainbowKit-supported wallet
- 📊 **Visual Graph** - See delegation chains visualized as interactive graphs with React Flow
- 📝 **Create Delegations** - Build delegations with an intuitive form interface
- 🛡️ **Explore Caveats** - Learn about different restriction types (enforcers)
- ▶️ **Simulate Redemption** - Watch the validation flow step-by-step
- ⛓️ **Real Blockchain** - Integration with MetaMask Smart Accounts Kit for live delegations

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Web3**: wagmi + viem + RainbowKit
- **Smart Accounts**: @metamask/smart-accounts-kit v0.3.0
- **Visualization**: React Flow (@xyflow/react)
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- A WalletConnect Project ID (for RainbowKit)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smartgator/delegation-playground.git
cd delegation-playground
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supported Networks

- **Base Sepolia** (testnet) - Default for testing
- **Base** (mainnet) - Production

## Delegation Framework

This playground uses the [MetaMask Delegation Framework](https://github.com/MetaMask/delegation-framework) v1.3.0:

- **DelegationManager**: `0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3`
- **EntryPoint**: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`

Learn more about the framework in the [official documentation](https://docs.metamask.io/delegation/).

## Roadmap

See [Issue #1](https://github.com/osobot-ai/delegation-playground/issues/1) for the full integration roadmap:

- ✅ Phase 1: Foundation - Wallet connection, Smart Accounts Kit integration
- 🚧 Phase 2: Functional Delegation Features - Live delegation creation
- ⏳ Phase 3: Redemption & Live Data - Real delegation storage
- ⏳ Phase 4: Polish - Expanded caveat explorer, error handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE for details.

## Acknowledgments

- Built with [MetaMask Smart Accounts Kit](https://docs.metamask.io/smart-accounts-kit/)
- Visualization powered by [React Flow](https://reactflow.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
