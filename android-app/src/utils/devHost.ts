import { NativeModules, Platform } from 'react-native';
import { DEV_API_HOST_OVERRIDE } from '../config/dev.config';

type AndroidConstants = {
  Model?: string;
  Brand?: string;
  Fingerprint?: string;
  model?: string;
  brand?: string;
  fingerprint?: string;
};

export const isAndroidEmulator = (): boolean => {
  if (Platform.OS !== 'android') return false;

  const constants = Platform.constants as AndroidConstants;
  const fingerprint = String(constants.Fingerprint ?? constants.fingerprint ?? '');
  const model = String(constants.Model ?? constants.model ?? '');
  const brand = String(constants.Brand ?? constants.brand ?? '');

  return (
    fingerprint.includes('generic') ||
    fingerprint.includes('unknown') ||
    model.toLowerCase().includes('sdk') ||
    model.toLowerCase().includes('emulator') ||
    (brand === 'google' && model.toLowerCase().includes('sdk'))
  );
};

/**
 * Resolves the dev machine IP for API calls.
 * - Emulator: 10.0.2.2 maps to host localhost
 * - Physical device: PC LAN IP (from override or Metro script URL)
 * - USB + adb reverse: localhost works if `adb reverse tcp:5000 tcp:5000` is set
 */
export const getDevApiHost = (): string => {
  if (DEV_API_HOST_OVERRIDE) {
    return DEV_API_HOST_OVERRIDE;
  }

  const scriptURL: string | undefined = NativeModules.SourceCode?.scriptURL;

  if (scriptURL) {
    const match = scriptURL.match(/https?:\/\/([^:/]+)/);
    const host = match?.[1];

    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      if (Platform.OS === 'android') {
        return isAndroidEmulator() ? '10.0.2.2' : 'localhost';
      }
      return 'localhost';
    }
  }

  if (Platform.OS === 'android') {
    return isAndroidEmulator() ? '10.0.2.2' : 'localhost';
  }

  return 'localhost';
};
