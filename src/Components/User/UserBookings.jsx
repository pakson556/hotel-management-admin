import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUserAuth } from "../../contexts/UserAuthContext";
import UserNavbar from "./UserNavbar";
import styled from "styled-components";
import { FaCheck, FaTimes, FaClock, FaDownload } from "react-icons/fa";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";

const BookingCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--lightShadow);
  transition: var(--mainTransition);
  border-left: 5px solid ${(props) =>
    props.status === "confirmed"
      ? "green"
      : props.status === "cancelled"
      ? "red"
      : "orange"};

  &:hover {
    box-shadow: var(--darkShadow);
  }
`;

const StatusBadge = styled.span`
  background: ${(props) =>
    props.status === "confirmed"
      ? "#d4edda"
      : props.status === "cancelled"
      ? "#f8d7da"
      : "#fff3cd"};
  color: ${(props) =>
    props.status === "confirmed"
      ? "#155724"
      : props.status === "cancelled"
      ? "#721c24"
      : "#856404"};
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

  const formatCurrency = (amount) => {
    return `£${Number(amount || 0).toLocaleString()}`;
  };

  const formatPaymentMethod = (method) => {
    if (method === "cash") return "Cash at Hotel";
    if (method === "card") return "Credit/Debit Card";
    if (method === "paypal") return "PayPal";
    return method || "N/A";
  };

  const formatBookingId = (id) => {
    return String(id || "").replace(/^-/, "");
  };

  useEffect(() => {
    if (state[2]) {
      const userBookings = Object.values(state[2])
        .filter((booking) => booking.userEmail === user?.email)
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(userBookings);
    }
  }, [state, user]);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await update(ref(db, `bookings/${bookingId}`), {
        bookingStatus: "cancelled",
      });
      alert("Booking cancelled successfully.");
    } catch (error) {
      alert("Failed to cancel booking.");
      console.error(error);
    }
  };

  const downloadInvoice = (booking) => {
    const totalNights = Math.max(
      1,
      Math.ceil(
        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
          (1000 * 60 * 60 * 24)
      )
    );

    const invoiceData = `
INVOICE
============

Booking ID: ${formatBookingId(booking.id)}
Date: ${new Date(booking.bookingDate).toLocaleDateString("en-GB")}

Room: ${booking.name}
Type: ${booking.type}
Check-in: ${new Date(booking.checkIn).toLocaleDateString("en-GB")}
Check-out: ${new Date(booking.checkOut).toLocaleDateString("en-GB")}
Guests: ${booking.guests}

Price per night: ${formatCurrency(booking.price)}
Total nights: ${totalNights}

TOTAL AMOUNT: ${formatCurrency(booking.totalPrice)}
Payment Method: ${formatPaymentMethod(booking.paymentMethod)}
Transaction ID: ${booking.transactionId || "N/A"}

Status: ${booking.bookingStatus}

Thank you for choosing our hotel!
    `.trim();

    const blob = new Blob([invoiceData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${formatBookingId(booking.id)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <UserNavbar />
      <div
        style={{
          marginTop: "100px",
          padding: "2rem",
          background: "var(--offWhite)",
          minHeight: "100vh",
        }}
      >
        <div className="container">
          <h2 className="mb-4" style={{ color: "var(--primaryColor)" }}>
            My Bookings
          </h2>

          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking.id} status={booking.bookingStatus}>
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      src={
                        booking.images?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1350&q=80"
                      }
                      alt={booking.name}
                      className="img-fluid rounded"
                      style={{ height: "100px", width: "150px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-md-3">
                    <h5>{booking.name}</h5>
                    <p className="text-muted mb-0">{booking.type}</p>
                    <small>
                      <strong>Booking ID:</strong> {formatBookingId(booking.id)}
                    </small>
                  </div>

                  <div className="col-md-2">
                    <p className="mb-0">
                      <strong>Check-in:</strong>
                      <br />
                      {new Date(booking.checkIn).toLocaleDateString("en-GB")}
                    </p>
                    <p className="mb-0 mt-2">
                      <strong>Check-out:</strong>
                      <br />
                      {new Date(booking.checkOut).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <div className="col-md-2">
                    <p className="mb-0">
                      <strong>Guests:</strong> {booking.guests}
                    </p>
                    <p className="mb-0">
                      <strong>Total:</strong> {formatCurrency(booking.totalPrice)}
                    </p>
                    <p className="mb-0">
                      <small>{formatPaymentMethod(booking.paymentMethod)}</small>
                    </p>
                  </div>

                  <div className="col-md-2">
                    <StatusBadge status={booking.bookingStatus}>
                      {booking.bookingStatus === "confirmed" && <FaCheck />}
                      {booking.bookingStatus === "cancelled" && <FaTimes />}
                      {booking.bookingStatus === "pending" && <FaClock />}
                      {booking.bookingStatus}
                    </StatusBadge>

                    <div className="mt-2 d-flex flex-column">
                      <button
                        className="btn btn-sm btn-outline-primary mb-2"
                        onClick={() => downloadInvoice(booking)}
                      >
                        <FaDownload /> Invoice
                      </button>

                      {booking.bookingStatus === "pending" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
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