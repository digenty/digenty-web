export const uploadImage = async (formData: FormData) => {
  try {
    const response = await fetch(`/api/image-upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data) {
      return data;
    } else {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};
