import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../contexts/UserAuthContext";
import { ref, update, get, child } from "firebase/database";
import { db } from "../../firebase";
import UserNavbar from "./UserNavbar";
import styled from "styled-components";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";

const ProfileCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--lightShadow);
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--primaryColor);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 4rem;
  border: 5px solid white;
  box-shadow: var(--lightShadow);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: var(--mainTransition);

  &:hover {
    background: #f8f9fa;
  }

  svg {
    color: var(--primaryColor);
    font-size: 1.5rem;
  }
`;

const EditButton = styled.button`
  background: transparent;
  border: 2px solid var(--primaryColor);
  color: var(--primaryColor);
  padding: 0.5rem 2rem;
  border-radius: 5px;
  transition: var(--mainTransition);
  font-weight: bold;

  &:hover {
    background: var(--primaryColor);
    color: white;
  }
`;

const UserProfile = () => {
  const { user } = useUserAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `Users/${user.uid}`));
        if (snapshot.exists()) {
          setProfileData(snapshot.val());
        } else {
          setProfileData({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            address: ""
          });
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    try {
      await update(ref(db, `Users/${user.uid}`), profileData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  return (
    <>
      <UserNavbar />
      <div style={{ marginTop: "100px", padding: "2rem", background: "var(--offWhite)", minHeight: "100vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <ProfileCard>
                <Avatar>
                  <FaUser />
                </Avatar>
                
                <h2 className="text-center mb-4">Profile Information</h2>
                
                {!isEditing ? (
                  <>
                    <InfoItem>
                      <FaUser />
                      <div>
                        <small className="text-muted">Full Name</small>
                        <p className="mb-0 h5">{profileData.name}</p>
                      </div>
                    </InfoItem>
                    
                    <InfoItem>
                      <FaEnvelope />
                      <div>
                        <small className="text-muted">Email</small>
                        <p className="mb-0 h5">{profileData.email}</p>
                      </div>
                    </InfoItem>
                    
                    <InfoItem>
                      <FaPhone />
                      <div>
                        <small className="text-muted">Phone</small>
                        <p className="mb-0 h5">{profileData.phone || "Not provided"}</p>
                      </div>
                    </InfoItem>
                    
                    <InfoItem>
                      <FaMapMarkerAlt />
                      <div>
                        <small className="text-muted">Address</small>
                        <p className="mb-0 h5">{profileData.address || "Not provided"}</p>
                      </div>
                    </InfoItem>
                    
                    <div className="text-center mt-4">
                      <EditButton onClick={() => setIsEditing(true)}>
                        <FaEdit /> Edit Profile
                      </EditButton>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone</label>
                      <PhoneInput
                        country={"gb"}
                        value={profileData.phone}
                        onChange={(phone) => setProfileData({...profileData, phone})}
                        inputStyle={{ width: "100%" }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="text-center">
                      <button className="btn btn-primary mr-2" onClick={handleUpdate}>
                        Save Changes
                      </button>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </ProfileCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;