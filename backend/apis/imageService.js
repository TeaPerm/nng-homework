const images = {
  cat: "https://placekitten.com/400/300",
  dog: "https://placedog.net/400/300",
  nature: "https://picsum.photos/400/300?random=1",
  city: "https://picsum.photos/400/300?random=2",
  mountain: "https://picsum.photos/400/300?random=3",
  ocean: "https://picsum.photos/400/300?random=4",
  bird: "https://loremflickr.com/400/300/bird",
};

export const imageService = {
  getImageByName: (name) => {
    if (images[name]) {
      return images[name];
    } else {
      return { success: false, error: "Image not found" };
    }
  },

  meta: {
    getImageByName: {
      params: [
        {
          name: "name",
          type: "string",
        },
      ],
    },
  },
};
