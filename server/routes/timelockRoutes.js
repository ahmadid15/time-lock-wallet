import express from 'express';
import {
  createTimeLockTx,
  getTimeLockTxDetails,
  broadcastSignedTx,
} from '../timelock.js';

const router = express.Router();

// Create time-lock transaction (lock funds)
router.post('/create', async (req, res) => {
  const { walletName, amount, lockTime, recipientAddress } = req.body;
  try {
    const result = await createTimeLockTx(walletName, amount, lockTime, recipientAddress);
    res.json({ tx: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get time-lock transaction details
router.get('/:txid', async (req, res) => {
  const { txid } = req.params;
  try {
    const details = await getTimeLockTxDetails(txid);
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Broadcast signed transaction (release funds)
router.post('/release', async (req, res) => {
  const { signedTxHex } = req.body;
  try {
    const broadcastResult = await broadcastSignedTx(signedTxHex);
    res.json({ txid: broadcastResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
