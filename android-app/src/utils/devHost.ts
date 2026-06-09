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
 *
 * Physical phone + Metro over USB reports localhost — that points to the phone,
 * not your PC. We use DEV_API_HOST_OVERRIDE (LAN IP) or adb reverse instead.
 */
export const getDevApiHost = (): string => {
  const scriptURL: string | undefined = NativeModules.SourceCode?.scriptURL;
  const metroMatch = scriptURL?.match(/https?:\/\/([^:/]+)/);
  const metroHost = metroMatch?.[1];

  if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1') {
    return metroHost;
  }

  if (DEV_API_HOST_OVERRIDE) {
    return DEV_API_HOST_OVERRIDE;
  }

  if (Platform.OS === 'android') {
    if (isAndroidEmulator()) return '10.0.2.2';
    // USB + `adb reverse tcp:5000 tcp:5000` makes localhost work on device
    return 'localhost';
  }

  return 'localhost';
};
