import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated. The prompt may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

interface RemixImageResult {
    imageUrl: string;
    text: string;
}

const fileToGenerativePart = (file: File) => {
    return new Promise<{inlineData: {data: string, mimeType: string}}>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file as base64"));
            }
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


export const remixImage = async (prompt: string, imageFile: File): Promise<RemixImageResult> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let imageUrl = '';
        let text = 'No text response from model.';

        // Safely access the response candidate and its parts to prevent crashes.
        const candidate = response.candidates?.[0];

        if (!candidate || !candidate.content || !candidate.content.parts) {
            // Check for a block reason to provide a more specific error message.
            const blockReason = response.promptFeedback?.blockReason;
            if (blockReason) {
                throw new Error(`Request was blocked due to: ${blockReason}. Please adjust your prompt.`);
            }
            throw new Error("Invalid response from the API. The model did not return any content.");
        }

        for (const part of candidate.content.parts) {
            if (part.text) {
                text = part.text;
            } else if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        if (!imageUrl) {
            throw new Error("No image was remixed. The prompt may have been blocked or the model did not return an image.");
        }

        return { imageUrl, text };

    } catch (error) {
        console.error("Error remixing image:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to remix image. An unexpected error occurred.");
    }
};