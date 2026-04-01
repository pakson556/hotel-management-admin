import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  FaWallet,
  FaHashtag,
  FaFileContract,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { db } from "../firebase";
import Navbar from "./Navbar";

const PageWrapper = styled.div`
  margin-top: 120px;
  padding: 0 2rem 3rem;
  background: var(--offWhite);
  min-height: 100vh;
`;

const PageTitle = styled.h2`
  color: var(--primaryColor);
  margin-bottom: 2rem;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--lightShadow);
  border-left: 6px solid
    ${(props) =>
      props.status === "confirmed"
        ? "green"
        : props.status === "cancelled"
        ? "red"
        : "blue"};
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 0.9fr;
  gap: 1rem;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  p {
    margin-bottom: 0.45rem;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #222;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: capitalize;
  background: ${(props) =>
    props.status === "confirmed"
      ? "#d4edda"
      : props.status === "cancelled"
      ? "#f8d7da"
      : "#dbeafe"};
  color: ${(props) =>
    props.status === "confirmed"
      ? "#155724"
      : props.status === "cancelled"
      ? "#721c24"
      : "#1d4ed8"};
`;

const PaymentBox = styled.div`
  margin-top: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
`;

const PaymentTitle = styled.h6`
  margin-bottom: 0.75rem;
  font-weight: bold;
`;

const BlockchainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  font-size: 0.95rem;
  word-break: break-word;

  svg {
    margin-right: 0.45rem;
    color: var(--primaryColor);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${(props) => (props.variant === "accept" ? "green" : "red")};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--lightShadow);
`;

const Divider = styled.hr`
  margin: 1rem 0;
`;

const BookingId = styled.div`
  font-weight: bold;
  word-break: break-word;
`;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    onValue(ref(db, "/bookings/"), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const bookingsArray = Object.values(data).sort(
          (a, b) =>
            new Date(b.timestamp || b.bookingDate || 0) -
            new Date(a.timestamp || a.bookingDate || 0)
        );
        setBookings(bookingsArray);
      } else {
        setBookings([]);
      }
    });
  }, []);

  const updateBooking = (bookingId, bookingStatus) => {
    update(ref(db, `bookings/${bookingId}`), {
      bookingStatus,
    });
  };

  const shorten = (text, start = 10, end = 8) => {
    if (!text) return "N/A";
    const str = String(text);
    if (str.length <= start + end) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
  };

  return (
    <>
      <Navbar />

      <PageWrapper>
        <PageTitle>Bookings</PageTitle>

        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const currentStatus =
              booking.bookingStatus || booking.status || "pending";

            return (
              <BookingCard key={booking.id} status={currentStatus}>
                <TopRow>
                  <Section>
                    <h4 style={{ marginBottom: "0.75rem" }}>
                      {booking.name || "Room Booking"}
                    </h4>
                    <p>
                      <Label>Booking ID:</Label>
                    </p>
                    <BookingId>{booking.id || "N/A"}</BookingId>
                    {booking.bookingReference && (
                      <p style={{ marginTop: "0.6rem" }}>
                        <Label>Reference:</Label> {booking.bookingReference}
                      </p>
                    )}
                    <p>
                      <Label>User Email:</Label> {booking.userEmail || "N/A"}
                    </p>
                    <p>
                      <Label>Room Type:</Label>{" "}
                      {booking.type ? booking.type.toUpperCase() : "N/A"}
                    </p>
                  </Section>

                  <Section>
                    <p>
                      <Label>Check In:</Label>{" "}
                      {booking.checkIn
                        ? new Date(booking.checkIn).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                    <p>
                      <Label>Check Out:</Label>{" "}
                      {booking.checkOut
                        ? new Date(booking.checkOut).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                    <p>
                      <Label>Guests:</Label>{" "}
                      {booking.guests || booking.capacity || "N/A"}
                    </p>
                    <p>
                      <Label>Total Price:</Label> £
                      {Number(booking.totalPrice || 0).toLocaleString()}
                    </p>
                  </Section>

                  <Section>
                    <p>
                      <Label>Payment Method:</Label>{" "}
                      {booking.paymentMethod || "N/A"}
                    </p>
                    <p>
                      <Label>Payment Mode:</Label>{" "}
                      {booking.paymentMode || "N/A"}
                    </p>
                    <p>
                      <Label>Payment Status:</Label>{" "}
                      {booking.paymentStatus || "N/A"}
                    </p>
                    {booking.blockchainAmountEth && (
                      <p>
                        <Label>Blockchain Amount:</Label>{" "}
                        {booking.blockchainAmountEth} ETH
                      </p>
                    )}
                  </Section>

                  <Section>
                    <p style={{ marginBottom: "0.75rem" }}>
                      <Label>Status:</Label>
                    </p>
                    <StatusBadge status={currentStatus}>
                      {currentStatus}
                    </StatusBadge>

                    {currentStatus === "pending" && (
                      <Actions>
                        <ActionButton
                          variant="accept"
                          onClick={() =>
                            updateBooking(booking.id, "confirmed")
                          }
                        >
                          <FaCheckCircle />
                          Accept
                        </ActionButton>

                        <ActionButton
                          variant="reject"
                          onClick={() =>
                            updateBooking(booking.id, "cancelled")
                          }
                        >
                          <FaTimesCircle />
                          Reject
                        </ActionButton>
                      </Actions>
                    )}
                  </Section>
                </TopRow>

                {booking.paymentMode === "blockchain" && (
                  <>
                    <Divider />
                    <PaymentBox>
                      <PaymentTitle>Blockchain Payment Details</PaymentTitle>

                      <BlockchainGrid>
                        <InfoItem>
                          <FaWallet />
                          <strong>Wallet:</strong>{" "}
                          {shorten(booking.walletAddress)}
                        </InfoItem>

                        <InfoItem>
                          <FaHashtag />
                          <strong>Tx Hash:</strong>{" "}
                          {shorten(booking.blockchainTxHash)}
                        </InfoItem>

                        <InfoItem>
                          <FaMoneyCheckAlt />
                          <strong>On-chain Booking ID:</strong>{" "}
                          {booking.blockchainBookingId || "N/A"}
                        </InfoItem>

                        <InfoItem>
                          <FaFileContract />
                          <strong>Contract:</strong>{" "}
                          {shorten(booking.contractAddress)}
                        </InfoItem>
                      </BlockchainGrid>
                    </PaymentBox>
                  </>
                )}
              </BookingCard>
            );
          })
        ) : (
          <EmptyState>
            <h1>No bookings.</h1>
            <Link to="/dashboard" className="btn btn-warning mt-4">
              Back to Dashboard
            </Link>
          </EmptyState>
        )}
      </PageWrapper>
    </>
  );
};

export default Bookings;