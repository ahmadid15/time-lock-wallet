import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RPC_USER = process.env.RPC_USER || 'admin';
const RPC_PASSWORD = process.env.RPC_PASSWORD || 'admin0123';
const RPC_PORT = process.env.RPC_PORT || 18443;
const RPC_HOST = process.env.RPC_HOST || '127.0.0.1';

export async function callRpc(method, params = [], wallet = '') {
  try {
    // Append wallet name to URL if provided
    const url = wallet 
      ? `http://${RPC_HOST}:${RPC_PORT}/wallet/${wallet}`
      : `http://${RPC_HOST}:${RPC_PORT}`;

    const response = await axios.post(
      url,
      {
        jsonrpc: '1.0',
        id: '1',
        method,
        params,
      },
      {
        auth: {
          username: RPC_USER,
          password: RPC_PASSWORD,
        },
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    return response.data.result;
  } catch (error) {
    console.error(`RPC call error: ${error.message}`);
    throw error;
  }
}
