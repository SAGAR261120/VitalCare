import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { create } from 'zustand';

interface NetworkStore {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  initialize: () => () => void;
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  isConnected: true,
  isInternetReachable: true,
  connectionType: null,

  initialize: () => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      set({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      set({
        isConnected: state.isConnected ?? true,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
    });

    return unsubscribe;
  },
}));

export const isOnline = (): boolean => {
  const { isConnected, isInternetReachable } = useNetworkStore.getState();
  return isConnected && isInternetReachable !== false;
};
