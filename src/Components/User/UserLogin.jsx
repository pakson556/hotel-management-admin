import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { useUserAuth } from "../../contexts/UserAuthContext";
import styled from "styled-components";

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
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: var(--darkShadow);
  width: 100%;
  max-width: 450px;
`;

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { userLogin } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await userLogin(email, password);
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <LoginBox>
        <h2 className="mb-4 text-center" style={{ color: "var(--primaryColor)" }}>
          Welcome Back!
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Button type="submit">Login</Button>
        </Form>
        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <Link to="/user/signup" style={{ color: "var(--primaryColor)" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </LoginBox>
    </Container>
  );
};

export default UserLogin;