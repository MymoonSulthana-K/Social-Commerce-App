import { ASSET_BASE_URL } from "./config";

export const resolveImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http") ||
    image.startsWith("//") ||
    image.startsWith("data:image")
  ) {
    return image;
  }

  return `${ASSET_BASE_URL}${image}`;
};
