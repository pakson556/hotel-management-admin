import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUserAuth } from "../../contexts/UserAuthContext";
import UserNavbar from "./UserNavbar";
import styled from "styled-components";
import { FaCheck, FaTimes, FaClock, FaDownload } from "react-icons/fa";

const BookingCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--lightShadow);
  transition: var(--mainTransition);
  border-left: 5px solid ${props => 
    props.status === "confirmed" ? "green" : 
    props.status === "cancelled" ? "red" : "orange"
  };

  &:hover {
    box-shadow: var(--darkShadow);
  }
`;

const StatusBadge = styled.span`
  background: ${props => 
    props.status === "confirmed" ? "#d4edda" : 
    props.status === "cancelled" ? "#f8d7da" : "#fff3cd"
  };
  color: ${props => 
    props.status === "confirmed" ? "#155724" : 
    props.status === "cancelled" ? "#721c24" : "#856404"
  };
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserBookings = () => {
  const { user } = useUserAuth();
  const state = useSelector((state) => state);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (state[2]) {
      const userBookings = Object.values(state[2])
        .filter(booking => booking.userEmail === user?.email)
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(userBookings);
    }
  }, [state, user]);

  const downloadInvoice = (booking) => {
    const invoiceData = `
      INVOICE
      ============
      Booking ID: ${booking.id}
      Date: ${new Date(booking.bookingDate).toLocaleDateString()}
      
      Room: ${booking.name}
      Type: ${booking.type}
      Check-in: ${new Date(booking.checkIn).toLocaleDateString()}
      Check-out: ${new Date(booking.checkOut).toLocaleDateString()}
      Guests: ${booking.guests}
      
      Price per night: Rs ${booking.price}
      Total nights: ${Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
      
      TOTAL AMOUNT: Rs ${booking.totalPrice}
      Payment Method: ${booking.paymentMethod}
      Transaction ID: ${booking.transactionId}
      
      Status: ${booking.bookingStatus}
      
      Thank you for choosing our hotel!
    `;

    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.id}.txt`;
    a.click();
  };

  return (
    <>
      <UserNavbar />
      <div style={{ marginTop: "100px", padding: "2rem", background: "var(--offWhite)", minHeight: "100vh" }}>
        <div className="container">
          <h2 className="mb-4" style={{ color: "var(--primaryColor)" }}>
            My Bookings
          </h2>

          {bookings.length > 0 ? (
            bookings.map(booking => (
              <BookingCard key={booking.id} status={booking.bookingStatus}>
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img 
                      src={booking.images?.[0]} 
                      alt={booking.name}
                      className="img-fluid rounded"
                      style={{ height: "100px", width: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-3">
                    <h5>{booking.name}</h5>
                    <p className="text-muted mb-0">{booking.type}</p>
                    <small>Booking ID: {booking.id}</small>
                  </div>
                  <div className="col-md-2">
                    <p className="mb-0">
                      <strong>Check-in:</strong><br />
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                    <p className="mb-0 mt-2">
                      <strong>Check-out:</strong><br />
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-2">
                    <p className="mb-0">
                      <strong>Guests:</strong> {booking.guests}
                    </p>
                    <p className="mb-0">
                      <strong>Total:</strong> Rs {booking.totalPrice}
                    </p>
                    <p className="mb-0">
                      <small>{booking.paymentMethod}</small>
                    </p>
                  </div>
                  <div className="col-md-2">
                    <StatusBadge status={booking.bookingStatus}>
                      {booking.bookingStatus === "confirmed" && <FaCheck />}
                      {booking.bookingStatus === "cancelled" && <FaTimes />}
                      {booking.bookingStatus === "pending" && <FaClock />}
                      {booking.bookingStatus}
                    </StatusBadge>
                    <button 
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() => downloadInvoice(booking)}
                    >
                      <FaDownload /> Invoice
                    </button>
                  </div>
                </div>
              </BookingCard>
            ))
          ) : (
            <div className="text-center py-5">
              <h3>No bookings found</h3>
              <p>Start by browsing our rooms and make your first booking!</p>
              <a href="/user/rooms" className="btn btn-primary mt-3">
                Browse Rooms
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBookings;