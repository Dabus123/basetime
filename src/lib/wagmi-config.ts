import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

const connectors = [
  injected(),
  metaMask(),
];

export const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(),
  },
});
