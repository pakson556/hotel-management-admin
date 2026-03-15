import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserAuth } from "../../contexts/UserAuthContext";
import { FaHotel, FaCalendarCheck, FaUser, FaStar } from "react-icons/fa";
import styled from "styled-components";
import UserNavbar from "./UserNavbar";

const DashboardContainer = styled.div`
  margin-top: 100px;
  padding: 2rem;
  min-height: 100vh;
  background: var(--offWhite);
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #5656f1 0%, #8e8ef5 100%);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: var(--lightShadow);
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: var(--lightShadow);
  text-align: center;
  transition: var(--mainTransition);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--darkShadow);
  }

  svg {
    font-size: 3rem;
    color: var(--primaryColor);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const UserDashboard = () => {
  const { user } = useUserAuth();
  const state = useSelector((state) => state);
  const [userBookings, setUserBookings] = useState([]);
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    if (state[0] && state[0][0]) {
      const featured = state[0][0].featuredRooms.slice(0, 3);
      setFeaturedRooms(featured);
    }

    if (state[2]) {
      const bookings = Object.values(state[2]).filter(
        (booking) => booking.userEmail === user?.email
      );
      setUserBookings(bookings);
    }
  }, [state, user]);

  return (
    <>
      <UserNavbar />
      <DashboardContainer>
        <div className="container">
          <WelcomeCard>
            <h1>Welcome back, {user?.displayName || "Guest"}!</h1>
            <p className="lead">Your next adventure awaits at our hotel</p>
          </WelcomeCard>

          <div className="row mb-5">
            <div className="col-md-4 mb-3">
              <StatCard onClick={() => window.location.href = "/user/rooms"}>
                <FaHotel />
                <h3>{state[0]?.[0]?.rooms?.length || 0}</h3>
                <p>Available Rooms</p>
              </StatCard>
            </div>
            <div className="col-md-4 mb-3">
              <StatCard onClick={() => window.location.href = "/user/my-bookings"}>
                <FaCalendarCheck />
                <h3>{userBookings.length}</h3>
                <p>Your Bookings</p>
              </StatCard>
            </div>
            <div className="col-md-4 mb-3">
              <StatCard onClick={() => window.location.href = "/user/profile"}>
                <FaUser />
                <h3>Profile</h3>
                <p>View & Edit</p>
              </StatCard>
            </div>
          </div>

          <h2 className="mb-4" style={{ color: "var(--primaryColor)" }}>
            Featured Rooms
          </h2>
          <div className="row">
            {featuredRooms.map((room) => (
              <div className="col-md-4 mb-4" key={room.id}>
                <div className="card room h-100">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{room.name}</h5>
                    <p className="card-text">
                      <FaStar className="text-warning" /> {room.type}
                    </p>
                    <p className="card-text">
                      <strong>Rs {room.price}</strong> / night
                    </p>
                    <Link
                      to={`/user/rooms/${room.slug}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
};

export default UserDashboard;