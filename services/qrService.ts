import jsQR from "jsqr";
import { ExtractionResult } from "../types";
import { getCroppedImg, parseWifiQr } from "../utils";

export const scanQrCode = async (
  imageSrc: string, 
  crop: { x: number, y: number, width: number, height: number }
): Promise<ExtractionResult> => {
  try {
    const imageData = await getCroppedImg(imageSrc, crop);
    
    if (!imageData) {
      return { success: false, error: "Failed to process image data." };
    }

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      console.log("QR Code detected:", code.data);
      const wifiData = parseWifiQr(code.data);

      if (wifiData) {
        return { success: true, data: wifiData };
      } else {
        return { success: false, error: "QR code is valid but does not contain standard WiFi data." };
      }
    } else {
      return { success: false, error: "No QR code found in the cropped area. Please ensure the QR code is clear and centered." };
    }
  } catch (error) {
    console.error("QR Scan Error:", error);
    return { success: false, error: "Failed to scan the image." };
  }
};
