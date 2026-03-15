import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const FilterSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: var(--lightShadow);
  margin-bottom: 2rem;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--lightShadow);
  transition: var(--mainTransition);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--darkShadow);
  }

  img {
    height: 250px;
    width: 100%;
    object-fit: cover;
    transition: var(--mainTransition);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const RoomInfo = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  h3 {
    color: var(--primaryColor);
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 1rem 0;
  }

  .features {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .btn-book {
    background: var(--primaryColor);
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    transition: var(--mainTransition);
    text-align: center;
    text-decoration: none;
    margin-top: auto;

    &:hover {
      background: #2c3e50;
      color: white;
      text-decoration: none;
    }
  }
`;

const UserRoomList = () => {
  const state = useSelector((state) => state);
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    capacity: 1,
    price: 10000,
    minSize: 0,
    maxSize: 10000,
    breakfast: false,
    pets: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const normalizeRoom = (room, index = 0) => {
    const fields = room?.fields || room;

    const images = Array.isArray(fields?.images)
      ? fields.images.map((img) => img?.fields?.file?.url).filter(Boolean)
      : Array.isArray(room?.images)
      ? room.images
      : [room?.image1, room?.image2, room?.image3, room?.image4].filter(Boolean);

    return {
      id: room?.sys?.id || room?.id || `room-${index}`,
      slug: fields?.slug || room?.slug || room?.id || `room-${index}`,
      name: fields?.name || room?.name || "Room",
      type: fields?.type || room?.type || "Standard",
      price: Number(fields?.price || room?.price || 0),
      size: Number(fields?.size || room?.size || 0),
      capacity: Number(fields?.capacity || room?.capacity || 1),
      breakfast: Boolean(fields?.breakfast ?? room?.breakfast),
      pets: Boolean(fields?.pets ?? room?.pets),
      description: fields?.description || room?.description || "",
      extras: fields?.extras || room?.extras || [],
      images,
    };
  };

  useEffect(() => {
    if (state[0] && state[0][0]) {
      const normalizedRooms = (state[0][0].rooms || []).map(normalizeRoom);

      let filteredRooms = [...normalizedRooms];

      if (filters.type !== "all") {
        filteredRooms = filteredRooms.filter((room) => room.type === filters.type);
      }

      filteredRooms = filteredRooms.filter(
        (room) => Number(room.capacity) >= Number(filters.capacity)
      );

      filteredRooms = filteredRooms.filter(
        (room) => Number(room.price) <= Number(filters.price)
      );

      filteredRooms = filteredRooms.filter(
        (room) =>
          Number(room.size) >= Number(filters.minSize) &&
          Number(room.size) <= Number(filters.maxSize)
      );

      if (filters.breakfast) {
        filteredRooms = filteredRooms.filter((room) => room.breakfast);
      }

      if (filters.pets) {
        filteredRooms = filteredRooms.filter((room) => room.pets);
      }

      if (searchTerm.trim()) {
        filteredRooms = filteredRooms.filter(
          (room) =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setRooms(filteredRooms);
    }
  }, [state, filters, searchTerm]);

  const allRooms = (state[0]?.[0]?.rooms || []).map(normalizeRoom);

  const roomTypes = ["all", ...new Set(allRooms.map((room) => room.type).filter(Boolean))];

  const maxRoomPrice = allRooms.length
    ? Math.max(...allRooms.map((room) => Number(room.price) || 0))
    : 10000;

  return (
    <>
      <UserNavbar />
      <div style={{ marginTop: "100px", padding: "2rem", background: "var(--offWhite)" }}>
        <div className="container">
          <FilterSection>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-2 mb-3">
                <select
                  className="form-control"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type === "all" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 mb-3">
                <select
                  className="form-control"
                  value={filters.capacity}
                  onChange={(e) =>
                    setFilters({ ...filters, capacity: parseInt(e.target.value, 10) })
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Person" : "People"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label>Max Price: £ {filters.price}</label>
                <input
                  type="range"
                  className="form-control-range"
                  min={0}
                  max={maxRoomPrice || 10000}
                  value={filters.price}
                  onChange={(e) =>
                    setFilters({ ...filters, price: parseInt(e.target.value, 10) })
                  }
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="breakfast"
                    checked={filters.breakfast}
                    onChange={(e) =>
                      setFilters({ ...filters, breakfast: e.target.checked })
                    }
                  />
                  <label className="custom-control-label" htmlFor="breakfast">
                    Breakfast Included
                  </label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="pets"
                    checked={filters.pets}
                    onChange={(e) => setFilters({ ...filters, pets: e.target.checked })}
                  />
                  <label className="custom-control-label" htmlFor="pets">
                    Pets Allowed
                  </label>
                </div>
              </div>
            </div>
          </FilterSection>

          <div className="row">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div className="col-lg-4 col-md-6 mb-4" key={room.id}>
                  <RoomCard>
                    <img
                      src={
                        room.images?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1350&q=80"
                      }
                      alt={room.name}
                    />
                    <RoomInfo>
                      <h3>{room.name}</h3>
                      <p>{room.type}</p>
                      <div className="features">
                        <span>Size: {room.size} sqft</span>
                        <span>Capacity: {room.capacity}</span>
                      </div>
                      <div className="price">£ {room.price}/night</div>
                      <Link to={`/user/rooms/${room.slug}`} className="btn-book">
                        View Details & Book
                      </Link>
                    </RoomInfo>
                  </RoomCard>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h3>No rooms match your criteria</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoomList;