import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  FaBed,
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPoundSign,
  FaPlus,
} from "react-icons/fa";
import Navbar from "./Navbar";

const PageWrapper = styled.div`
  margin-top: 120px;
  padding: 0 2rem 3rem;
  min-height: 100vh;
  background: var(--offWhite);
`;

const HeroCard = styled.div`
  background: linear-gradient(135deg, #4f46e5, #818cf8);
  color: white;
  border-radius: 18px;
  padding: 2.2rem;
  margin-bottom: 2rem;
  box-shadow: var(--darkShadow);

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 0;
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h1 {
      font-size: 2.2rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const SectionTitle = styled.h2`
  color: var(--primaryColor);
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.8rem;
  text-align: center;
  box-shadow: var(--lightShadow);
  transition: var(--mainTransition);

  &:hover {
    box-shadow: var(--darkShadow);
    transform: translateY(-4px);
  }
`;

const IconWrap = styled.div`
  font-size: 2.8rem;
  color: #4f46e5;
  margin-bottom: 1rem;
`;

const StatNumber = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: ${(props) => props.color || "#222"};
`;

const StatLabel = styled.p`
  color: #555;
  font-size: 1.1rem;
  margin-bottom: ${(props) => (props.compact ? "0" : "1rem")};
`;

const ActionButton = styled(Link)`
  display: inline-block;
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: var(--mainTransition);

  &:hover {
    background: #1d4ed8;
    color: white;
    text-decoration: none;
  }
`;

const QuickActions = styled.div`
  margin-top: 0.5rem;
`;

const AddRoomButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #16a34a;
  color: white;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: var(--mainTransition);

  &:hover {
    background: #15803d;
    color: white;
    text-decoration: none;
  }
`;

const AdminDashboard = () => {
  const state = useSelector((state) => state);

  const rooms = state?.[0]?.[0]?.rooms || [];
  const users = state?.[1] ? Object.values(state[1]) : [];
  const bookings = state?.[2] ? Object.values(state[2]) : [];

  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "confirmed"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === "pending"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.bookingStatus === "cancelled"
  );

  const totalRevenue = confirmedBookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice || 0),
    0
  );

  const formatCurrency = (amount) => {
    return `£${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <>
      <Navbar />

      <PageWrapper className="container">
        <HeroCard>
          <h1>Welcome back, Admin!</h1>
          <p>Manage rooms, users, bookings, and revenue from one place.</p>
        </HeroCard>

        <SectionTitle>Overview</SectionTitle>

        <CardGrid>
          <DashboardCard>
            <IconWrap>
              <FaBed />
            </IconWrap>
            <StatNumber>{rooms.length}</StatNumber>
            <StatLabel>Total Rooms</StatLabel>
            <ActionButton to="/rooms">Manage Rooms</ActionButton>
          </DashboardCard>

          <DashboardCard>
            <IconWrap>
              <FaUsers />
            </IconWrap>
            <StatNumber>{users.length}</StatNumber>
            <StatLabel>Total Users</StatLabel>
            <ActionButton to="/users">View Users</ActionButton>
          </DashboardCard>

          <DashboardCard>
            <IconWrap>
              <FaClipboardList />
            </IconWrap>
            <StatNumber>{bookings.length}</StatNumber>
            <StatLabel>Total Bookings</StatLabel>
            <ActionButton to="/bookings">View Bookings</ActionButton>
          </DashboardCard>
        </CardGrid>

        <SectionTitle>Booking Status</SectionTitle>

        <CardGrid>
          <DashboardCard>
            <IconWrap style={{ color: "#16a34a" }}>
              <FaCheckCircle />
            </IconWrap>
            <StatNumber color="#16a34a">
              {confirmedBookings.length}
            </StatNumber>
            <StatLabel compact>Confirmed Bookings</StatLabel>
          </DashboardCard>

          <DashboardCard>
            <IconWrap style={{ color: "#f59e0b" }}>
              <FaClock />
            </IconWrap>
            <StatNumber color="#f59e0b">{pendingBookings.length}</StatNumber>
            <StatLabel compact>Pending Bookings</StatLabel>
          </DashboardCard>

          <DashboardCard>
            <IconWrap style={{ color: "#ef4444" }}>
              <FaTimesCircle />
            </IconWrap>
            <StatNumber color="#ef4444">
              {cancelledBookings.length}
            </StatNumber>
            <StatLabel compact>Cancelled Bookings</StatLabel>
          </DashboardCard>
        </CardGrid>

        <SectionTitle>Revenue & Actions</SectionTitle>

        <CardGrid>
          <DashboardCard>
            <IconWrap>
              <FaPoundSign />
            </IconWrap>
            <StatNumber color="#2563eb">
              {formatCurrency(totalRevenue)}
            </StatNumber>
            <StatLabel compact>Total Revenue</StatLabel>
          </DashboardCard>
        </CardGrid>

        <QuickActions>
          <AddRoomButton to="/addRoom">
            <FaPlus />
            Add New Room
          </AddRoomButton>
        </QuickActions>
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;