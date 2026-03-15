import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { useUserAuth } from "../../contexts/UserAuthContext";
import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Button = styled.button`
  background-color: #5656f1;
  padding: 10px;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 20px;
  width: 100%;
  transition: var(--mainTransition);

  &:hover {
    background-color: white;
    color: #5656f1;
    border: 2px solid #5656f1;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")
    center/cover no-repeat fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SignupBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: var(--darkShadow);
  width: 100%;
  max-width: 500px;
`;

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const { userSignup } = useUserAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await userSignup(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.address
      );
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <SignupBox>
        <h2 className="mb-4 text-center" style={{ color: "var(--primaryColor)" }}>
          Create Account
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3 phoneInput">
            <PhoneInput
              country={"gb"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%", height: "38px" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
              className="form-control"
            />
          </Form.Group>

          <Button type="submit">Sign Up</Button>
        </Form>
        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link to="/user/login" style={{ color: "var(--primaryColor)" }}>
              Login
            </Link>
          </p>
        </div>
      </SignupBox>
    </Container>
  );
};

export default UserSignup;