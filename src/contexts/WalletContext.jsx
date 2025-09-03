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

  // Use Solana devnet for development
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

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

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = publicKey;

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signature = await wallet.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature.signature);
      
      // Update balance after transaction
      await updateBalance(publicKey);
      
      return signature.signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
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