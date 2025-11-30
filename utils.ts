import { WifiData } from "./types";

/**
 * Parses a standard WiFi QR code string.
 * Format: WIFI:S:SSID;T:Type;P:Password;H:Hidden;;
 */
export const parseWifiQr = (text: string): WifiData | null => {
  if (!text.startsWith('WIFI:')) {
    return null;
  }

  const result: WifiData = {
    ssid: '',
    networkType: 'nopass',
    hidden: false,
    password: ''
  };

  // Remove WIFI: prefix
  const content = text.substring(5);
  
  // Custom parser to handle escaped characters (e.g. \; or \:)
  let buffer = '';
  let key = '';
  let readingKey = true; // true = reading key, false = reading value

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '\\' && i + 1 < content.length) {
      // Handle escape sequence, add next char literally
      buffer += content[i + 1];
      i++;
      continue;
    }

    if (readingKey) {
      if (char === ':') {
        key = buffer;
        buffer = '';
        readingKey = false;
      } else if (char === ';') {
        // Empty key/value pair or end of string, reset
        buffer = '';
        readingKey = true;
      } else {
        buffer += char;
      }
    } else {
      if (char === ';') {
        // End of value
        const val = buffer;
        
        // Map keys
        if (key === 'S') result.ssid = val;
        if (key === 'P') result.password = val;
        if (key === 'T') result.networkType = val;
        if (key === 'H') result.hidden = val.toLowerCase() === 'true';

        buffer = '';
        readingKey = true;
      } else {
        buffer += char;
      }
    }
  }

  if (!result.ssid) return null;

  return result;
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<ImageData | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set width to double the crop width for better resolution (retina supportish)
  // or just 1:1. 1:1 is usually fine for QR.
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
