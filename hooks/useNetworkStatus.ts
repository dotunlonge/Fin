import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected && networkState.isInternetReachable);
      } catch (error) {
        console.error('Error checking network status:', error);
        setIsConnected(true); // Default to connected to avoid blocking UI
      }
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
  };
}

