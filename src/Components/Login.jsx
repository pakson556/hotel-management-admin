import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { useUserAuth } from "../contexts/UserAuthContext";
import styled from "styled-components";

const Button = styled.button`
  background-color: blue;
  padding: 10px;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 20px;
  width: 100%;

  &:hover {
    background-color: white;
    color: blue;
    border: 2px solid blue;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await logIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 box" style={{ width: "50%", margin: "100px auto" }}>
        <h2 className="mb-3 text-center">Admin Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </div>
        </Form>

        <hr />

        <div className="text-center mt-3">
          <p>
            Not an admin?{" "}
            <Link to="/" style={{ color: "blue" }}>
              Go to User Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;