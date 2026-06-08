/**
 * Physical Android devices cannot use 10.0.2.2 (emulator-only).
 * Set this to your PC's Wi-Fi IP (run `ipconfig` → IPv4 Address).
 * Set to null to rely on auto-detection from Metro.
 */
export const DEV_API_HOST_OVERRIDE: string | null = '192.168.1.3';
