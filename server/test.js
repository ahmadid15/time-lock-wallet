import {createWallet} from "./wallet.js";

(async () => {
  try {
    const res = await createWallet('demo_wallet');
    console.log('Wallet created:', res);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
})();
