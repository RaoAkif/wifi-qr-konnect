export interface WifiData {
  ssid: string;
  password?: string;
  networkType: string;
  hidden: boolean;
}

export interface ExtractionResult {
  success: boolean;
  data?: WifiData;
  error?: string;
}
