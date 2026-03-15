import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

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

      <div className="container" style={{ marginTop: "120px" }}>
        <h1 className="mb-4">Admin Dashboard</h1>

        {/* Top Stats */}
        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center">
              <h2>{rooms.length}</h2>
              <p>Total Rooms</p>
              <Link to="/rooms" className="btn btn-primary">
                Manage Rooms
              </Link>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center">
              <h2>{users.length}</h2>
              <p>Total Users</p>
              <Link to="/users" className="btn btn-primary">
                View Users
              </Link>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center">
              <h2>{bookings.length}</h2>
              <p>Total Bookings</p>
              <Link to="/bookings" className="btn btn-primary">
                View Bookings
              </Link>
            </div>
          </div>

        </div>

        {/* Booking Status Stats */}
        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center border-success">
              <h2 className="text-success">{confirmedBookings.length}</h2>
              <p>Confirmed Bookings</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center border-warning">
              <h2 className="text-warning">{pendingBookings.length}</h2>
              <p>Pending Bookings</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center border-danger">
              <h2 className="text-danger">{cancelledBookings.length}</h2>
              <p>Cancelled Bookings</p>
            </div>
          </div>

        </div>

        {/* Revenue */}
        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4 text-center border-primary">
              <h2 className="text-primary">{formatCurrency(totalRevenue)}</h2>
              <p>Total Revenue</p>
            </div>
          </div>

        </div>

        {/* Admin Actions */}
        <div className="mt-4">
          <Link to="/addRoom" className="btn btn-success me-3">
            Add New Room
          </Link>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;