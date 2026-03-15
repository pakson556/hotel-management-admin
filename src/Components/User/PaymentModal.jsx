import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import styled from "styled-components";
import { FaCreditCard, FaPaypal, FaMoneyBill } from "react-icons/fa";

const PaymentButton = styled.button`
  background: ${props => props.selected ? "var(--primaryColor)" : "white"};
  color: ${props => props.selected ? "white" : "#333"};
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

const PaymentModal = ({ show, onHide, roomDetails, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete({
        method: paymentMethod,
        status: "success",
        transactionId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
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
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
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
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
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
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </Form.Group>
          </Form>
        );
      case "paypal":
        return (
          <div className="text-center py-4">
            <FaPaypal size={50} color="#003087" />
            <p className="mt-3">You will be redirected to PayPal to complete your payment.</p>
          </div>
        );
      case "cash":
        return (
          <div className="text-center py-4">
            <FaMoneyBill size={50} color="green" />
            <p className="mt-3">Pay with cash at the hotel upon arrival.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Complete Your Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <h5>Booking Summary</h5>
            <p>
              <strong>Room:</strong> {roomDetails?.name}<br />
              <strong>Price:</strong> Rs {roomDetails?.price}/night<br />
              <strong>Total:</strong> Rs {roomDetails?.totalPrice}
            </p>
          </div>
          <div className="col-md-6">
            <h5>Select Payment Method</h5>
            <PaymentButton
              selected={paymentMethod === "card"}
              onClick={() => setPaymentMethod("card")}
            >
              <FaCreditCard /> Credit/Debit Card
            </PaymentButton>
            <PaymentButton
              selected={paymentMethod === "paypal"}
              onClick={() => setPaymentMethod("paypal")}
            >
              <FaPaypal /> PayPal
            </PaymentButton>
            <PaymentButton
              selected={paymentMethod === "cash"}
              onClick={() => setPaymentMethod("cash")}
            >
              <FaMoneyBill /> Cash at Hotel
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
        <button className="btn btn-secondary" onClick={onHide}>
          Cancel
        </button>
        {paymentMethod && (
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? "Processing..." : `Pay Rs ${roomDetails?.totalPrice}`}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;