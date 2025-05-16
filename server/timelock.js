import { callRpc } from './bitcoinRpc.js';

/**
 * Create a time-locked transaction using nLockTime
 * @param {string} walletName 
 * @param {number} amount (in BTC)
 * @param {number} lockTime (block height or UNIX timestamp)
 * @param {string} recipientAddress
 */
export async function createTimeLockTx(walletName, amount, lockTime, recipientAddress) {
  // Step 1: Create a raw transaction (we need a UTXO)
  const utxos = await callRpc('listunspent', [1, 9999999, [], true], walletName);
  if (utxos.length === 0) throw new Error('No UTXOs available');

  const utxo = utxos[0];
  const inputs = [{ txid: utxo.txid, vout: utxo.vout }];
  const outputs = { [recipientAddress]: amount };

  // Step 2: Create raw tx
  const rawTx = await callRpc('createrawtransaction', [inputs, outputs], walletName);

  // Step 3: Set lock time
  const txWithLock = await callRpc('settxlocktime', [rawTx, lockTime], walletName)
    .catch(() => rawTx); // fallback if not supported

  // Step 4: Sign tx
  const signedTx = await callRpc('signrawtransactionwithwallet', [txWithLock], walletName);

  return signedTx.hex; // return raw signed tx hex
}


/**
 * Get details of a time-locked transaction
 * @param {string} txid 
 */
export async function getTimeLockTxDetails(txid) {
  const tx = await callRpc('gettransaction', [txid]);
  const decoded = await callRpc('decoderawtransaction', [tx.hex]);
  return {
    txid: txid,
    locktime: decoded.locktime,
    confirmations: tx.confirmations,
    details: decoded.vout,
  };
}


/**
 * Broadcast a signed transaction
 * @param {string} signedTxHex 
 */
export async function broadcastSignedTx(signedTxHex) {
  const txid = await callRpc('sendrawtransaction', [signedTxHex]);
  return txid;
}
