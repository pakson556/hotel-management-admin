import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set, get, child } from "firebase/database";

export const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState(null);

  // User Login (for regular users)
  async function userLogin(email, password) {
    try {
      // First, authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user exists in database and is not admin (or allow both)
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `Users/${user.uid}`));
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // You can choose to allow both admins and users to login through userLogin
        // or restrict to non-admins only. For now, let's allow both.
        return userCredential;
      } else {
        // If user doesn't exist in database, create a basic record
        await set(ref(db, `Users/${user.uid}`), {
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email: email,
          isAdmin: false,
          createdAt: new Date().toISOString()
        });
        return userCredential;
      }
    } catch (error) {
      throw error;
    }
  }

  // User Signup
  async function userSignup(email, password, name, phone = "", address = "") {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });

      // Save user data to Realtime Database (note: "Users" with capital U to match your DB)
      await set(ref(db, `Users/${user.uid}`), {
        id: user.uid,
        name: name,
        email: email,
        phone: phone,
        address: address,
        isAdmin: false, // Regular users are not admins by default
        createdAt: new Date().toISOString()
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // User Logout
  function userLogout() {
    return signOut(auth);
  }

  // Admin Login (existing)
  async function logIn(email, password) {
    try {
      // First, authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is admin in database
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `Users/${user.uid}`));
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.isAdmin === true) {
          return userCredential;
        } else {
          // If not admin, sign out and throw error
          await signOut(auth);
          throw new Error("Not an admin account");
        }
      } else {
        // User doesn't exist in database
        await signOut(auth);
        throw new Error("User not found in database");
      }
    } catch (error) {
      throw error;
    }
  }

  // Admin Logout (existing)
  function logOut() {
    return signOut(auth);
  }

  // Check if current user is admin
  async function isUserAdmin(uid) {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `Users/${uid}`));
      if (snapshot.exists()) {
        return snapshot.val().isAdmin === true;
      }
      return false;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);
      
      if (currentuser) {
        // Fetch additional user data from Realtime Database
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `Users/${currentuser.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          // If user exists in Auth but not in Database, create a basic record
          const basicUserData = {
            id: currentuser.uid,
            name: currentuser.displayName || currentuser.email.split('@')[0],
            email: currentuser.email,
            isAdmin: false,
            createdAt: new Date().toISOString()
          };
          await set(ref(db, `Users/${currentuser.uid}`), basicUserData);
          setUserData(basicUserData);
        }
      } else {
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        userData,
        userLogin,
        userSignup,
        userLogout,
        logIn,
        logOut,
        isUserAdmin
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}