import { StoredImage } from '../types';

declare var JSZip: any;
declare var saveAs: any;

const dataURLToBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

export const createZipFromImages = async (images: StoredImage[]): Promise<void> => {
  if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
    console.error("JSZip or FileSaver not loaded. Make sure they are included in index.html");
    throw new Error("Downloading library is not available.");
  }
  
  const zip = new JSZip();
  let promptsText = "Prompts for images in this archive:\n\n";

  images.forEach((image, index) => {
    const fileExtension = dataURLToBlob(image.imageDataUrl).type.split('/')[1] || 'jpg';
    const fileName = `image_${index + 1}_${image.id}.${fileExtension}`;
    
    // Add image file
    zip.file(fileName, dataURLToBlob(image.imageDataUrl));
    
    // Add prompt info to text file
    promptsText += `File: ${fileName}\n`;
    promptsText += `Type: ${image.type}\n`;
    if(image.aspectRatio) {
        promptsText += `Aspect Ratio: ${image.aspectRatio}\n`;
    }
    promptsText += `Prompt: "${image.prompt}"\n`;
    promptsText += `----------------------------------------\n\n`;
  });

  zip.file("prompts.txt", promptsText);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `francine-studio-batch-${Date.now()}.zip`);
};
