import { onValue, ref, update } from "firebase/database";
import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Navbar from "./Navbar";

const StatusTD = styled.td`
  font-weight: bold;
  color: ${(props) =>
    props.type === "pending"
      ? "blue"
      : props.type === "confirmed" || props.type === "Accepted"
      ? "green"
      : props.type === "cancelled" || props.type === "Rejected"
      ? "red"
      : "black"};
`;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  React.useEffect(() => {
    onValue(ref(db, "/bookings/"), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setBookings(Object.values(data));
      } else {
        setBookings([]);
      }
    });
  }, []);

  const updateBooking = (bookingNumb, bookingStatus) => {
    update(ref(db, `bookings/${bookingNumb}`), {
      bookingStatus,
    });
  };

  return (
    <>
      <Navbar />

      <div style={{ marginTop: "120px" }}>
        {bookings.length > 0 ? (
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{ width: "90%", margin: "0 auto" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>User Email</th>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Guests</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Accept</th>
                <th>Reject</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userEmail || "N/A"}</td>
                  <td>{booking.name || "N/A"}</td>
                  <td>{booking.type ? booking.type.toUpperCase() : "N/A"}</td>
                  <td>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</td>
                  <td>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</td>
                  <td>{booking.guests || booking.capacity || "N/A"}</td>
                  <td>{booking.totalPrice || "N/A"}</td>
                  <StatusTD type={booking.bookingStatus || booking.status}>
                    {booking.bookingStatus || booking.status || "pending"}
                  </StatusTD>

                  {(booking.bookingStatus === "pending" || booking.status === "Pending") ? (
                    <>
                      <td style={{ textAlign: "center" }}>
                        <FaCheckCircle
                          color="green"
                          style={{ cursor: "pointer", fontSize: "20px" }}
                          onClick={() => updateBooking(booking.id, "confirmed")}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <FaTimesCircle
                          color="red"
                          style={{ cursor: "pointer", fontSize: "20px" }}
                          onClick={() => updateBooking(booking.id, "cancelled")}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ textAlign: "center" }}>-</td>
                      <td style={{ textAlign: "center" }}>-</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="container roomerror">
            <div className="row my-5">
              <div className="col-md-6 col-12 mx-auto">
                <div className="card shadow-lg border-0 p-4 error">
                  <h1 className="text-center display-4">No bookings.</h1>
                  <Link to="/dashboard" className="btn btn-warning mt-4">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;