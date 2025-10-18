import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

const connectors = [
  injected(),
  metaMask(),
];

export const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
  },
});
