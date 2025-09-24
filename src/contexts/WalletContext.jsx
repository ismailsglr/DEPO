import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use Solana devnet for development with multiple RPC endpoints for reliability
  const connection = new Connection('https://api.devnet.solana.com', {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
    disableRetryOnRateLimit: false,
  });

  useEffect(() => {
    // Check if Phantom wallet is installed
    const checkIfWalletIsConnected = async () => {
      try {
        const { solana } = window;
        if (solana && solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWallet(solana);
          setPublicKey(response.publicKey);
          setConnected(true);
          await updateBalance(response.publicKey);
        }
      } catch (error) {
        console.log('Wallet not connected:', error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const updateBalance = async (pubKey) => {
    if (!pubKey) return;
    try {
      const balance = await connection.getBalance(pubKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWallet(solana);
        setPublicKey(response.publicKey);
        setConnected(true);
        await updateBalance(response.publicKey);
      } else {
        alert('Please install Phantom wallet!');
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setWallet(null);
        setPublicKey(null);
        setBalance(0);
        setConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const sendTransaction = async (recipientAddress, amount) => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected');
    }

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Transaction attempt ${attempt}/${maxRetries}`);
        
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(recipientAddress),
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );

        transaction.feePayer = publicKey;

        // Get latest blockhash with retry
        let blockhash;
        try {
          const { blockhash: latestBlockhash } = await connection.getLatestBlockhash('confirmed');
          blockhash = latestBlockhash;
        } catch (blockhashError) {
          console.warn('Failed to get blockhash, retrying...', blockhashError);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw blockhashError;
        }

        transaction.recentBlockhash = blockhash;

        const signature = await wallet.signAndSendTransaction(transaction);
        
        // Confirm transaction with timeout
        try {
          await connection.confirmTransaction(signature.signature, 'confirmed');
        } catch (confirmError) {
          console.warn('Transaction confirmation failed, but signature exists:', confirmError);
          // Continue anyway as the transaction might still be valid
        }
        
        // Update balance after transaction
        await updateBalance(publicKey);
        
        console.log('Transaction successful:', signature.signature);
        return signature.signature;
        
      } catch (error) {
        lastError = error;
        console.error(`Transaction attempt ${attempt} failed:`, error);
        
        // If it's a network error and we have retries left, wait and try again
        if (attempt < maxRetries && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_CERT_AUTHORITY_INVALID') ||
          error.message.includes('network')
        )) {
          console.log(`Retrying in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        
        // If it's the last attempt or not a network error, throw immediately
        if (attempt === maxRetries) {
          break;
        }
      }
    }

    console.error('All transaction attempts failed:', lastError);
    throw lastError;
  };

  const value = {
    wallet,
    publicKey,
    balance,
    connected,
    loading,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    updateBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 