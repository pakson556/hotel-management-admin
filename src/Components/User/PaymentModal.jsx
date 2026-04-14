import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import styled from "styled-components";
import {
  FaCreditCard,
  FaPaypal,
  FaWallet,
} from "react-icons/fa";

const PaymentButton = styled.button`
  background: ${(props) =>
    props.selected ? "var(--primaryColor)" : "white"};
  color: ${(props) => (props.selected ? "white" : "#333")};
  border: 2px solid var(--primaryColor);
  padding: 1rem;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 1rem;
  transition: var(--mainTransition);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &:hover {
    background: var(--primaryColor);
    color: white;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const InfoBox = styled.div`
  background: #f8f9fa;
  border-left: 4px solid var(--primaryColor);
  padding: 1rem;
  border-radius: 6px;
`;

const ChainNote = styled.div`
  background: #fff8e1;
  border-left: 4px solid #f59e0b;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
  color: #92400e;
`;

const PaymentModal = ({ show, onHide, roomDetails, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    try {
      setProcessing(true);

      if (paymentMethod === "metamask") {
        await onPaymentComplete({
          method: "metamask",
          status: "processing",
        });
        return;
      }

      // Simulate traditional payment processing, then trigger on-chain proof
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await onPaymentComplete({
        method: paymentMethod,
        status: "success",
        transactionId:
          "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                  maxLength="19"
                />
              </Form.Group>

              <div className="row">
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expiry: e.target.value })
                      }
                      maxLength="5"
                    />
                  </Form.Group>
                </div>

                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      maxLength="3"
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
            <ChainNote>
              <strong>On-chain proof required:</strong> After card processing, MetaMask will prompt you to confirm a small Sepolia ETH transaction ({roomDetails?.blockchainAmountEth || "0.0010"} ETH) as an immutable booking record on the blockchain.
            </ChainNote>
          </>
        );

      case "paypal":
        return (
          <>
            <div className="text-center py-4">
              <FaPaypal size={50} color="#003087" />
              <p className="mt-3">
                A demo PayPal payment will be processed.
              </p>
            </div>
            <ChainNote>
              <strong>On-chain proof required:</strong> After PayPal processing, MetaMask will prompt you to confirm a small Sepolia ETH transaction ({roomDetails?.blockchainAmountEth || "0.0010"} ETH) as an immutable booking record on the blockchain.
            </ChainNote>
          </>
        );

      case "metamask":
        return (
          <InfoBox className="mt-3">
            <h6 className="mb-2">Blockchain Payment (Sepolia TestNet)</h6>
            <p className="mb-2">
              MetaMask will open and ask you to approve the booking payment on
              the Ethereum Sepolia test network.
            </p>
            <p className="mb-1">
              <strong>Contract:</strong> {roomDetails?.contractAddressPreview || "HotelBooking"}
            </p>
            <p className="mb-1">
              <strong>Booking Reference:</strong> {roomDetails?.bookingReference}
            </p>
            <p className="mb-0">
              <strong>Amount:</strong>{" "}
              {roomDetails?.blockchainAmountEth || "0.0010"} ETH
            </p>
          </InfoBox>
        );

      default:
        return null;
    }
  };

  const getPayButtonText = () => {
    if (processing) return "Processing...";
    if (paymentMethod === "metamask") {
      return `Pay with MetaMask (${roomDetails?.blockchainAmountEth || "0.0010"} ETH)`;
    }
    return `Pay £ ${Number(roomDetails?.totalPrice || 0).toLocaleString()}`;
  };

  return (
    <Modal show={show} onHide={processing ? undefined : onHide} size="lg" centered>
      <Modal.Header closeButton={!processing}>
        <Modal.Title>Complete Your Booking</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <h5>Booking Summary</h5>
            <p>
              <strong>Room:</strong> {roomDetails?.name}
              <br />
              <strong>Price:</strong> £{" "}
              {Number(roomDetails?.price || 0).toLocaleString()}
              /night
              <br />
              <strong>Total:</strong> £{" "}
              {Number(roomDetails?.totalPrice || 0).toLocaleString()}
            </p>
          </div>

          <div className="col-md-6">
            <h5>Select Payment Method</h5>

            <PaymentButton
              type="button"
              selected={paymentMethod === "metamask"}
              onClick={() => setPaymentMethod("metamask")}
            >
              <FaWallet /> MetaMask / Blockchain
            </PaymentButton>

            <PaymentButton
              type="button"
              selected={paymentMethod === "card"}
              onClick={() => setPaymentMethod("card")}
            >
              <FaCreditCard /> Credit/Debit Card
            </PaymentButton>

            <PaymentButton
              type="button"
              selected={paymentMethod === "paypal"}
              onClick={() => setPaymentMethod("paypal")}
            >
              <FaPaypal /> PayPal
            </PaymentButton>
          </div>
        </div>

        {paymentMethod && (
          <div className="mt-4">
            <h5>Payment Details</h5>
            {renderPaymentForm()}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide} disabled={processing}>
          Cancel
        </button>

        {paymentMethod && (
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={processing}
          >
            {getPayButtonText()}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
