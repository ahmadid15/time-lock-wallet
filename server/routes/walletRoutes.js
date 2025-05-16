import express from "express";
import {
  createWallet,
  loadWallet,
  getNewAddress,
  getBalance,
  listWallets,
  getWalletAddresses,
  listWalletTransactions
} from "../wallet.js";

const router = express.Router();

// Create wallet
router.post("/create", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await createWallet(name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Load wallet
router.post("/load", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await loadWallet(name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get new address
router.get("/:name/address", async (req, res) => {
  const { name } = req.params;
  try {
    const result = await getNewAddress(name);
    res.json({ address: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get balance
router.get("/:name/balance", async (req, res) => {
  const { name } = req.params;
  try {
    const result = await getBalance(name);
    res.json({ balance: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List wallets
router.get("/list", async (req, res) => {
  try {
    const wallets = await listWallets();
    res.json({ wallets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all addresses for a wallet
router.get("/:name/addresses", async (req, res) => {
  const { name } = req.params;
  try {
    const addresses = await getWalletAddresses(name);
    res.json({ addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List transactions for a wallet
router.get('/:name/transactions', async (req, res) => {
    const { name } = req.params;
    const count = parseInt(req.query.count) || 100;
    const skip = parseInt(req.query.skip) || 0;
  
    try {
      const transactions = await listWalletTransactions(name, count, skip);
      res.json({ transactions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

export default router;
