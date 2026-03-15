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
    pets: false
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (state[0] && state[0][0]) {
      let filteredRooms = state[0][0].rooms;

      // Apply filters
      if (filters.type !== "all") {
        filteredRooms = filteredRooms.filter(room => room.type === filters.type);
      }

      filteredRooms = filteredRooms.filter(room => room.capacity >= filters.capacity);
      filteredRooms = filteredRooms.filter(room => room.price <= filters.price);
      filteredRooms = filteredRooms.filter(room => room.size >= filters.minSize && room.size <= filters.maxSize);

      if (filters.breakfast) {
        filteredRooms = filteredRooms.filter(room => room.breakfast);
      }

      if (filters.pets) {
        filteredRooms = filteredRooms.filter(room => room.pets);
      }

      if (searchTerm) {
        filteredRooms = filteredRooms.filter(room =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setRooms(filteredRooms);
    }
  }, [state, filters, searchTerm]);

  const roomTypes = ["all", ...new Set(state[0]?.[0]?.rooms?.map(room => room.type) || [])];

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
                  onChange={(e) => setFilters({ ...filters, capacity: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Person" : "People"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Max Price: Rs {filters.price}</label>
                <input
                  type="range"
                  className="form-control-range"
                  min={0}
                  max={state[0]?.[0]?.maxPrice || 10000}
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: parseInt(e.target.value) })}
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
                    onChange={(e) => setFilters({ ...filters, breakfast: e.target.checked })}
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
              rooms.map(room => (
                <div className="col-lg-4 col-md-6 mb-4" key={room.id}>
                  <RoomCard>
                    <img src={room.images[0]} alt={room.name} />
                    <RoomInfo>
                      <h3>{room.name}</h3>
                      <p>{room.type}</p>
                      <div className="features">
                        <span>Size: {room.size} sqft</span>
                        <span>Capacity: {room.capacity}</span>
                      </div>
                      <div className="price">Rs {room.price}/night</div>
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