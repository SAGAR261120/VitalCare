/**
 * Your PC's Wi-Fi IP for API calls on a physical device.
 * Run `ipconfig` → IPv4 Address when your network changes.
 * Metro over USB uses localhost and cannot reach the backend without this.
 */
export const DEV_API_HOST_OVERRIDE: string | null = '192.168.1.3';
