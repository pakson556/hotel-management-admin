import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";

import { useUserAuth } from "../contexts/UserAuthContext";
import { auth, db } from "../firebase";

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

  &:disabled {
    background-color: #8aa4ff;
    color: white;
    border: none;
    cursor: not-allowed;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-email":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many login attempts. Please wait a little and try again.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      default:
        return "Login failed. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await logIn(trimmedEmail, trimmedPassword);
      const firebaseUser = userCredential?.user || auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Unable to verify login user.");
      }

      const userRef = ref(db, `Users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await signOut(auth);
        setError("No admin profile found for this account.");
        setLoading(false);
        return;
      }

      const userData = snapshot.val();

      if (!userData?.isAdmin) {
        await signOut(auth);
        setError("Access denied. This account is not an admin account.");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyErrorMessage(err?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
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
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: "8px" }}
                />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
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
  );
};

export default Login;