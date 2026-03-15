import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaAlignRight, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useUserAuth } from "../../contexts/UserAuthContext";

const UserNavbar = () => {
  const { userLogout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userLogout();
      navigate("/user/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-transparent py-2 fixed-top scrolled">
      <div className="container-fluid">
        <span
          className="navbar-brand font-weight-bolder"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/user/dashboard")}
        >
          Hotel User
        </span>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-toggle="collapse"
          data-target="#userNavbar"
        >
          <FaAlignRight className="nav-icon" />
        </button>
        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/rooms">
                Browse Rooms
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/my-bookings">
                My Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/user/profile">
                <FaUser /> Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-danger ml-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;