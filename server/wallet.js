import { callRpc } from "./bitcoinRpc.js";

async function createWallet(walletName) {
  return await callRpc("createwallet", [walletName]);
}

async function loadWallet(walletName) {
  return await callRpc("loadwallet", [walletName]);
}

async function getNewAddress(walletName) {
  return await callRpc("getnewaddress", [], walletName);
}

async function getWalletAddresses(walletName) {
  const result = await callRpc("listreceivedbyaddress", [0, true], walletName);
  return result.map((entry) => entry.address);
}

async function getBalance(walletName) {
  return await callRpc("getbalance", [], walletName);
}

async function listWallets() {
  return await callRpc("listwallets");
}

async function listWalletTransactions(walletName) {
  const result = await callRpc("listtransactions", ["*", 100], walletName);
  return result;
}

export {
  createWallet,
  loadWallet,
  getNewAddress,
  getBalance,
  listWallets,
  getWalletAddresses,
  listWalletTransactions
};
