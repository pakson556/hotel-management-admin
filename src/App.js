import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import Rooms from "./Components/Rooms";
import { onValue, ref } from "firebase/database";
import { db } from "./firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SingleRooms from "./Components/SingleRooms";
import AddRooms from "./Components/AddRooms";
import UpdateRoom from "./Components/updateRoom";
import Users from "./Components/Users";
import Bookings from "./Components/Bookings";
import { UserAuthContextProvider } from "./contexts/UserAuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Components/Login";

// User Pages
import UserLogin from "./Components/User/UserLogin";
import UserSignup from "./Components/User/UserSignup";
import UserDashboard from "./Components/User/UserDashboard";
import UserRoomList from "./Components/User/UserRoomList";
import UserRoomDetails from "./Components/User/UserRoomDetails";
import UserBookings from "./Components/User/UserBookings";
import UserProfile from "./Components/User/UserProfile";
import UserProtectedRoute from "./Components/User/UserProtectedRoute";

function App() {
  const dispatch = useDispatch();
  
  const getFromFirebase = () => {
    const dbRef = ref(db);
    onValue(dbRef, (snapshot) => {
      const outData = snapshot.val();
      dispatch({
        type: "FIREBASE",
        payload: {
          outData,
        },
      });
    });
  };

  useEffect(() => {
    getFromFirebase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
          <Route path="/addRoom" element={<ProtectedRoute><AddRooms /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/update-room/" element={<ProtectedRoute><UpdateRoom /></ProtectedRoute>} />
          <Route path="/update-room/:slug" element={<ProtectedRoute><UpdateRoom /></ProtectedRoute>} />
          <Route path="/rooms/:slug" element={<ProtectedRoute><SingleRooms /></ProtectedRoute>} />
          <Route path="/" element={<Login />} />
          
          {/* User Routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/dashboard" element={<UserProtectedRoute><UserDashboard /></UserProtectedRoute>} />
          <Route path="/user/rooms" element={<UserProtectedRoute><UserRoomList /></UserProtectedRoute>} />
          <Route path="/user/rooms/:slug" element={<UserProtectedRoute><UserRoomDetails /></UserProtectedRoute>} />
          <Route path="/user/my-bookings" element={<UserProtectedRoute><UserBookings /></UserProtectedRoute>} />
          <Route path="/user/profile" element={<UserProtectedRoute><UserProfile /></UserProtectedRoute>} />
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;