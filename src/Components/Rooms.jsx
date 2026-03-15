import React from "react";
import RoomsContainer from "./RoomsContainer";
import Navbar from "./Navbar";

const Rooms = () => {
  return (
    <>
      <Navbar />

      <div style={{ marginTop: "120px" }}>
        <RoomsContainer />
      </div>
    </>
  );
};

export default Rooms;