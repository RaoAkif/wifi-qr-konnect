import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExtractionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wifiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ssid: {
      type: Type.STRING,
      description: "The SSID or Network Name of the WiFi.",
    },
    password: {
      type: Type.STRING,
      description: "The password for the WiFi network. Return empty string if none.",
    },
    networkType: {
      type: Type.STRING,
      description: "The security type (e.g., WPA, WEP, WPA2, OPEN).",
    },
    hidden: {
      type: Type.BOOLEAN,
      description: "Whether the network is hidden (true/false).",
    },
    isValidWifiQr: {
      type: Type.BOOLEAN,
      description: "Set to true if the image contains a valid WiFi QR code or text. Set to false if no WiFi data is found.",
    }
  },
  required: ["ssid", "networkType", "hidden", "isValidWifiQr"],
};

export const extractWifiData = async (base64Image: string): Promise<ExtractionResult> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this image. It should contain a WiFi QR code. Decode it and extract the SSID, Password, Network Type, and Hidden status. If it is not a WiFi QR code, set isValidWifiQr to false.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: wifiSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      return { success: false, error: "No response from AI." };
    }

    const parsed = JSON.parse(jsonText);

    if (!parsed.isValidWifiQr) {
      return { success: false, error: "No valid WiFi QR code detected in the image." };
    }

    return {
      success: true,
      data: {
        ssid: parsed.ssid,
        password: parsed.password || "",
        networkType: parsed.networkType,
        hidden: parsed.hidden,
      },
    };

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return { success: false, error: "Failed to decode the image. Please try again." };
  }
};
