export const uploadImage = async (formData: FormData): Promise<{ url: string } | null> => {
  try {
    const response = await fetch(`/api/image-upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};
