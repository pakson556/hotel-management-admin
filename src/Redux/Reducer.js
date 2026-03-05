const initialState = [];

function formatData(items) {
  if (!items) return [];

  const list = Array.isArray(items) ? items : Object.values(items);

  return list
    .filter(Boolean)
    .map((item) => {
      const id = item?.sys?.id ?? item?.id ?? item?._id ?? "";

      const images =
        item?.fields?.images
          ?.map((img) => img?.fields?.file?.url)
          .filter(Boolean) ?? [];
      const roomFields = item?.fields ?? item;

      return { ...roomFields, images, id };
    });
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "FIREBASE": {
      const hotels = payload?.outData?.hotels ?? null;
      const users = payload?.outData?.users ?? [];

      let rooms = formatData(hotels);
      rooms = rooms.filter(Boolean);

      const featuredRooms = rooms.filter((room) => room?.featured === true);

      const slug = rooms[0]?.slug ?? "";

      const maxPrice = rooms.length
        ? Math.max(...rooms.map((item) => Number(item?.price ?? 0)))
        : 0;

      const maxSize = rooms.length
        ? Math.max(...rooms.map((item) => Number(item?.size ?? 0)))
        : 0;

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

      return [roomsData, users];
    }

    default:
      return state;
  }
};