const initialState = [];

function formatData(items) {
  if (!items) return [];

  return Object.entries(items).map(([key, item]) => {
    const images =
      item.images ||
      item.imageurls ||
      [item.image1, item.image2, item.image3, item.image4].filter(Boolean);

    return {
      ...item,
      id: item.id || key,
      slug: item.slug || key,
      images: Array.isArray(images) ? images : [],
    };
  });
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "FIREBASE": {
      let rooms = payload.outData?.hotels ? formatData(payload.outData.hotels) : [];

      rooms = rooms.filter(Boolean);

      const featuredRooms = rooms.filter((room) => room.featured === true);
      const slug = rooms[0]?.slug || "";
      const maxPrice = rooms.length ? Math.max(...rooms.map((item) => Number(item.price) || 0)) : 0;
      const maxSize = rooms.length ? Math.max(...rooms.map((item) => Number(item.size) || 0)) : 0;

      const roomsData = [
        {
          slug,
          rooms,
          featuredRooms,
          sortedRooms: rooms,
          loading: false,
          price: maxPrice,
          maxPrice,
          maxSize,
          breakfast: false,
          pets: false,
          type: "all",
          capacity: 1,
          minPrice: 0,
          minSize: 0,
        },
      ];

      const users = payload.outData?.Users || {};
      const bookings = payload.outData?.bookings || {};

      return [roomsData, users, bookings];
    }

    default:
      return state;
  }
};