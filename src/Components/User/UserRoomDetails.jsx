import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ref, push, set } from "firebase/database";
import { db } from "../../firebase";
import { useUserAuth } from "../../contexts/UserAuthContext";
import UserNavbar from "./UserNavbar";
import PaymentModal from "./PaymentModal";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWifi } from "react-icons/fa";

const HeroSection = styled.div`
  height: 60vh;
  background: url(${props => props.img}) center/cover no-repeat;
  position: relative;
  margin-top: 76px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 1;
  }
`;

const BookingCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: var(--darkShadow);
  position: sticky;
  top: 100px;
`;

const UserRoomDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const state = useSelector((state) => state);
  
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (state[0] && state[0][0]) {
      const foundRoom = state[0][0].rooms.find(r => r.slug === slug);
      setRoom(foundRoom);
    }
  }, [state, slug]);

  const calculateTotal = () => {
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return room ? room.price * nights : 0;
  };

  const handleBooking = () => {
    const total = calculateTotal();
    setBookingDetails({
      ...room,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      totalPrice: total,
      userEmail: user.email,
      userName: user.displayName,
      bookingDate: new Date().toISOString()
    });
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentInfo) => {
    const bookingRef = ref(db, "bookings");
    const newBookingRef = push(bookingRef);
    
    const bookingData = {
      ...bookingDetails,
      id: newBookingRef.key,
      paymentMethod: paymentInfo.method,
      paymentStatus: paymentInfo.status,
      transactionId: paymentInfo.transactionId,
      bookingStatus: "confirmed",
      timestamp: new Date().toISOString()
    };

    await set(newBookingRef, bookingData);
    
    setShowPayment(false);
    alert("Booking confirmed! Check your email for details.");
    navigate("/user/my-bookings");
  };

  if (!room) {
    return (
      <>
        <UserNavbar />
        <div className="container text-center py-5" style={{ marginTop: "100px" }}>
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <HeroSection img={room.images[0]}>
        <div className="content">
          <h1>{room.name}</h1>
          <p className="lead">{room.type}</p>
        </div>
      </HeroSection>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <div className="row mb-4">
              {room.images.slice(1).map((img, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <img src={img} alt={room.name} className="img-fluid rounded" />
                </div>
              ))}
            </div>

            <h3>About this room</h3>
            <p className="lead">{room.description}</p>

            <h4 className="mt-4">Amenities</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  {room.extras && room.extras.map((extra, index) => (
                    <li key={index} className="mb-2">
                      <FaWifi className="text-primary mr-2" /> {extra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h4 className="mt-4">Features</h4>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Size:</strong> {room.size} sqft</p>
                <p><strong>Capacity:</strong> {room.capacity} guests</p>
              </div>
              <div className="col-md-6">
                <p><strong>Breakfast:</strong> {room.breakfast ? "Included" : "Not included"}</p>
                <p><strong>Pets:</strong> {room.pets ? "Allowed" : "Not allowed"}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <BookingCard>
              <h4>Book this room</h4>
              <p className="h3 text-primary">Rs {room.price}<small>/night</small></p>
              
              <div className="form-group">
                <label>Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={date => setCheckIn(date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  className="form-control"
                  dateFormat="MM/dd/yyyy"
                />
              </div>

              <div className="form-group">
                <label>Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={date => setCheckOut(date)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn}
                  className="form-control"
                  dateFormat="MM/dd/yyyy"
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <select 
                  className="form-control"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span>Total:</span>
                <span className="h5">Rs {calculateTotal()}</span>
              </div>

              <button 
                className="btn btn-primary btn-block btn-lg"
                onClick={handleBooking}
              >
                Proceed to Book
              </button>
            </BookingCard>
          </div>
        </div>
      </div>

      <PaymentModal
        show={showPayment}
        onHide={() => setShowPayment(false)}
        roomDetails={bookingDetails}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default UserRoomDetails;