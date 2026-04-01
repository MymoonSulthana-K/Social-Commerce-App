export const resolveImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http") ||
    image.startsWith("//") ||
    image.startsWith("data:image")
  ) {
    return image;
  }

  return `http://localhost:5000${image}`;
};
