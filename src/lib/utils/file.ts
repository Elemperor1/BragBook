export async function getImageDimensions(file: File) {
  if (!file.type.startsWith("image/")) {
    return {};
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("Unable to read image dimensions"));
        image.src = objectUrl;
      },
    );

    return dimensions;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
