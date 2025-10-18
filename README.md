# BaseTime - Onchain Social Calendar

BaseTime is a social onchain calendar that lets users view, create, and share events in the Base ecosystem. RSVP to events and mint Event Pass NFTs as proof of attendance.

## 🎯 Features

- **View Events**: Scrollable feed of upcoming onchain and community events
- **Create Events**: Authenticated users can create events with name, description, start/end time, image, and optional onchain actions
- **RSVP System**: One-click RSVP triggers Base wallet transaction that mints Event Pass NFTs
- **Social Sharing**: Generate OpenGraph previews optimized for Base social surfaces
- **Mobile-First**: Touch-optimized layout with clean Base-blue accents
- **Base App Integration**: Runs natively inside Base App with MiniKit + OnchainKit

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Blockchain**: Base Sepolia testnet
- **SDKs**: @coinbase/onchainkit, wagmi, ethers
- **Smart Contracts**: Solidity with OpenZeppelin
- **Storage**: IPFS for event metadata and images
- **Animations**: Framer Motion
- **Icons**: Heroicons

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Base testnet wallet with test ETH
- OnchainKit API key
- WalletConnect Project ID
- Pinata API keys (optional, for IPFS)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd basetime
pnpm install
```

### 2. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Contract Addresses (set after deployment)
NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS=
NEXT_PUBLIC_RSVP_TOKEN_ADDRESS=

# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Deployment Configuration
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

### 3. Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.ts --network baseTestnet
```

After deployment, update your `.env.local` with the contract addresses:

```env
NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_RSVP_TOKEN_ADDRESS=0x...
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see BaseTime in action!

## 📱 Smart Contracts

### EventRegistry.sol

Manages event creation and RSVP functionality:

- `createEvent()` - Create new events with metadata
- `rsvpToEvent()` - RSVP to events
- `cancelRSVP()` - Cancel RSVP
- `getActiveEvents()` - Fetch all active events
- `getUserRSVPs()` - Get user's RSVPed events

### RSVPToken.sol

ERC-721 contract for Event Pass NFTs:

- `mintEventPass()` - Mint NFT for event RSVP
- `batchMintEventPasses()` - Batch mint for multiple users
- `getEventForToken()` - Get event ID for token
- `getTokensForEvent()` - Get tokens for specific event

## 🎨 Components

### Core Components

- **EventCard**: Displays event details with RSVP button
- **EventFeed**: Scrollable feed with filtering and sorting
- **CreateModal**: Modal for event creation
- **Providers**: OnchainKit + Wagmi provider setup

### Pages

- **`/`**: Home page with event feed
- **`/event/[id]`**: Event detail page
- **`/my`**: User's events and RSVPs (coming soon)

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Smart Contracts
npx hardhat compile     # Compile contracts
npx hardhat test        # Run tests
npx hardhat deploy     # Deploy contracts
npx hardhat verify     # Verify contracts on BaseScan
```

### Project Structure

```
basetime/
├── contracts/           # Smart contracts
│   ├── EventRegistry.sol
│   └── RSVPToken.sol
├── scripts/            # Deployment scripts
│   └── deploy.ts
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Configuration and utilities
│   ├── types/         # TypeScript types
│   └── utils/         # Helper functions
├── public/
│   └── .well-known/   # Base App manifest
└── hardhat.config.ts  # Hardhat configuration
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contracts (Base Sepolia)

```bash
# Deploy contracts
npx hardhat run scripts/deploy.ts --network baseTestnet

# Verify contracts
npx hardhat verify --network baseTestnet <contract-address>
```

## 📋 Base Build Checklist

- ✅ **Framework**: Next.js + TypeScript + TailwindCSS
- ✅ **Blockchain**: Base testnet integration
- ✅ **SDKs**: OnchainKit + Wagmi properly configured
- ✅ **Smart Contracts**: EventRegistry + RSVPToken deployed
- ✅ **Authentication**: Deferred auth with OnchainKit
- ✅ **Manifest**: Complete farcaster.json for Base App discovery
- ✅ **Mobile-First**: Touch-optimized responsive design
- ✅ **Social**: OpenGraph previews and sharing
- ✅ **Performance**: Optimized for <2s load time

## 🎯 Usage

### Creating Events

1. Connect your Base wallet
2. Click "Create Event" button
3. Fill in event details (name, description, times, image)
4. Add optional onchain action URL
5. Submit transaction

### RSVPing to Events

1. Browse events on the home page
2. Click "RSVP" button on any event
3. Confirm transaction in wallet
4. Receive Event Pass NFT as proof of attendance

### Sharing Events

1. Click "Share" button on any event
2. Native sharing dialog opens (mobile)
3. Or copy link to clipboard (desktop)
4. Rich OpenGraph previews for social platforms

## 🔒 Security

- Smart contracts use OpenZeppelin standards
- Input validation on all user inputs
- Proper access controls and ownership
- Gas-optimized contract functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [Base Mini Apps Guide](https://docs.base.org/mini-apps/)
- **Discord**: [Base Discord](https://discord.gg/buildonbase)
- **Issues**: GitHub Issues for bug reports

## 🎉 Acknowledgments

- Base team for the amazing ecosystem
- OnchainKit team for the excellent SDK
- OpenZeppelin for secure contract standards
- Next.js team for the great framework

---

**Built with ❤️ for the Base ecosystem**