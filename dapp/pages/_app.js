import "../styles/globals.css";
import { Layout } from "../components/Layout";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const wallabyTestnet = {
  /** ID in number form */
  id: 31415,
  /** Human-readable name */
  name: "Filecoin — Wallaby testnet",
  /** Internal network name */
  network: "wallabytestnet",
  /** Currency used by chain */
  nativeCurrency: { name: "tFIL", symbol: "FIL", decimals: 18 },
  /** Collection of RPC endpoints */
  rpcUrls: {
    default: "https://aurora-testnet.infura.io/v3",
  },
  blockExplorers: {
    default: "https://explorer.glif.io/wallaby",
  },
  testnet: true,
};

function MyApp({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [wallabyTestnet],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: `https://wallaby.node.glif.io/rpc/v0`,
        }),
      }),
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: "De-Tok",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
