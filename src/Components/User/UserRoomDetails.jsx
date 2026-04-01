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
import {
  bookRoomOnChain,
  calculateBlockchainAmountEth,
  CONTRACT_ADDRESS,
} from "../../blockchain/contract";

const HeroSection = styled.div`
  height: 60vh;
  background: url(${(props) => props.img}) center/cover no-repeat;
  position: relative;
  margin-top: 76px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
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

  const normalizeRoom = (roomObj, index = 0) => {
    const fields = roomObj?.fields || roomObj;

    const images = Array.isArray(fields?.images)
      ? fields.images.map((img) => img?.fields?.file?.url).filter(Boolean)
      : Array.isArray(roomObj?.images)
      ? roomObj.images
      : [
          roomObj?.image1,
          roomObj?.image2,
          roomObj?.image3,
          roomObj?.image4,
        ].filter(Boolean);

    const extras = Array.isArray(fields?.extras)
      ? fields.extras
      : Array.isArray(roomObj?.extras)
      ? roomObj.extras
      : typeof roomObj?.extras === "string"
      ? roomObj.extras
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    return {
      id: roomObj?.sys?.id || roomObj?.id || `room-${index + 1}`,
      chainRoomId: index + 1,
      slug:
        fields?.slug || roomObj?.slug || roomObj?.id || `room-${index + 1}`,
      name: fields?.name || roomObj?.name || "Room",
      type: fields?.type || roomObj?.type || "Standard",
      price: Number(fields?.price || roomObj?.price || 0),
      size: Number(fields?.size || roomObj?.size || 0),
      capacity: Number(fields?.capacity || roomObj?.capacity || 1),
      breakfast: Boolean(fields?.breakfast ?? roomObj?.breakfast),
      pets: Boolean(fields?.pets ?? roomObj?.pets),
      description: fields?.description || roomObj?.description || "",
      extras,
      images,
    };
  };

  useEffect(() => {
    if (state?.[0]?.[0]?.rooms) {
      const normalizedRooms = state[0][0].rooms.map(normalizeRoom);
      const foundRoom = normalizedRooms.find((r) => r.slug === slug);
      setRoom(foundRoom || null);
    }
  }, [state, slug]);

  const calculateTotal = () => {
    const nights = Math.max(
      1,
      Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    );
    return room ? room.price * nights : 0;
  };

  const handleBooking = () => {
    if (!room || !user) return;

    const total = calculateTotal();
    const bookingReference = `HB-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    setBookingDetails({
      ...room,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      totalPrice: total,
      userEmail: user.email,
      userName: user.displayName || user.email,
      bookingDate: new Date().toISOString(),
      bookingReference,
      blockchainAmountEth: calculateBlockchainAmountEth(total),
      contractAddressPreview: `${CONTRACT_ADDRESS.slice(
        0,
        6
      )}...${CONTRACT_ADDRESS.slice(-4)}`,
    });

    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentInfo) => {
    if (!bookingDetails) return;

    try {
      let finalPaymentInfo = {
        ...paymentInfo,
      };

      // all bookings should wait for admin approval
      let bookingStatus = "pending";
      let paymentMode = "traditional";

      if (paymentInfo.method === "metamask") {
        finalPaymentInfo = await bookRoomOnChain({
          roomId: bookingDetails.chainRoomId,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          guests: bookingDetails.guests,
          bookingRef: bookingDetails.bookingReference,
          totalPriceGbp: bookingDetails.totalPrice,
        });

        paymentMode = "blockchain";
        bookingStatus = "pending";
      }

      const bookingRef = ref(db, "bookings");
      const newBookingRef = push(bookingRef);

      const bookingData = {
        ...bookingDetails,
        id: newBookingRef.key,
        paymentMethod: finalPaymentInfo.method,
        paymentMode,
        paymentStatus: finalPaymentInfo.status || "success",
        transactionId:
          finalPaymentInfo.transactionId ||
          finalPaymentInfo.blockchainTxHash ||
          "",
        blockchainTxHash: finalPaymentInfo.blockchainTxHash || "",
        blockchainBookingId: finalPaymentInfo.blockchainBookingId || "",
        walletAddress: finalPaymentInfo.walletAddress || "",
        chainId: finalPaymentInfo.chainId || "",
        contractAddress: finalPaymentInfo.contractAddress || CONTRACT_ADDRESS,
        bookingReference:
          finalPaymentInfo.bookingReference || bookingDetails.bookingReference,
        blockchainAmountEth:
          finalPaymentInfo.blockchainAmountEth ||
          bookingDetails.blockchainAmountEth,
        bookingStatus,
        timestamp: new Date().toISOString(),
      };

      await set(newBookingRef, bookingData);

      setShowPayment(false);
      alert(
        paymentInfo.method === "metamask"
          ? "Blockchain payment completed. Booking submitted and waiting for admin approval."
          : "Booking submitted successfully and waiting for admin approval."
      );
      navigate("/user/my-bookings");
    } catch (error) {
      console.error(error);
      alert(error?.message || "Payment failed. Please try again.");
    }
  };

  if (!state?.[0]?.[0]?.rooms) {
    return (
      <>
        <UserNavbar />
        <div
          className="container text-center py-5"
          style={{ marginTop: "100px" }}
        >
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <UserNavbar />
        <div
          className="container text-center py-5"
          style={{ marginTop: "100px" }}
        >
          <h2>Room not found</h2>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/user/rooms")}
          >
            Back to Rooms
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />

      <HeroSection
        img={
          room.images?.[0] ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1350&q=80"
        }
      >
        <div className="content">
          <h1>{room.name}</h1>
          <p className="lead">{room.type}</p>
        </div>
      </HeroSection>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <div className="row mb-4">
              {(room.images || []).slice(1).map((img, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <img
                    src={img}
                    alt={room.name}
                    className="img-fluid rounded"
                  />
                </div>
              ))}
            </div>

            <h3>About this room</h3>
            <p className="lead">{room.description}</p>

            <h4 className="mt-4">Amenities</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  {(room.extras || []).length > 0 ? (
                    room.extras.map((extra, index) => (
                      <li key={index} className="mb-2">
                        <FaWifi className="text-primary mr-2" /> {extra}
                      </li>
                    ))
                  ) : (
                    <li className="mb-2">No extras listed</li>
                  )}
                </ul>
              </div>
            </div>

            <h4 className="mt-4">Features</h4>
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Size:</strong> {room.size} sqft
                </p>
                <p>
                  <strong>Capacity:</strong> {room.capacity} guests
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Breakfast:</strong>{" "}
                  {room.breakfast ? "Included" : "Not included"}
                </p>
                <p>
                  <strong>Pets:</strong> {room.pets ? "Allowed" : "Not allowed"}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <BookingCard>
              <h4>Book this room</h4>
              <p className="h3 text-primary">
                £ {Number(room.price).toLocaleString()}
                <small>/night</small>
              </p>

              <div className="form-group">
                <label>Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="form-group">
                <label>Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <select
                  className="form-control"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Total:</span>
                <span className="h5">
                  £ {Number(calculateTotal()).toLocaleString()}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Demo blockchain total:</span>
                <span className="text-muted">
                  {calculateBlockchainAmountEth(calculateTotal())} ETH
                </span>
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