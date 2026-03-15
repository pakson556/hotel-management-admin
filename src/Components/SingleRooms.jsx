import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Banner from "./Banner";
import StyledHero from "./StyledHero";
import { ref, remove } from "firebase/database";
import { db } from "../firebase";
import Navbar from "./Navbar";

const SingleRooms = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  const rooms = state?.[0]?.[0]?.rooms || [];

  const normalizeRoom = (roomObj, index = 0) => {
    const fields = roomObj?.fields || roomObj;

    const images = Array.isArray(fields?.images)
      ? fields.images.map((img) => img?.fields?.file?.url).filter(Boolean)
      : Array.isArray(roomObj?.images)
      ? roomObj.images
      : [roomObj?.image1, roomObj?.image2, roomObj?.image3, roomObj?.image4].filter(Boolean);

    const extras = Array.isArray(fields?.extras)
      ? fields.extras
      : Array.isArray(roomObj?.extras)
      ? roomObj.extras
      : typeof roomObj?.extras === "string"
      ? roomObj.extras.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const id = roomObj?.sys?.id || roomObj?.id || `room-${index}`;
    const roomSlug = fields?.slug || roomObj?.slug || id;

    return {
      id: String(id),
      slug: String(roomSlug),
      name: fields?.name || roomObj?.name || "Room",
      type: fields?.type || roomObj?.type || "Standard",
      price: Number(fields?.price || roomObj?.price || 0),
      size: Number(fields?.size || roomObj?.size || 0),
      capacity: Number(fields?.capacity || roomObj?.capacity || 1),
      breakfast: Boolean(fields?.breakfast ?? roomObj?.breakfast),
      pets: Boolean(fields?.pets ?? roomObj?.pets),
      description: fields?.description || roomObj?.description || "No description available.",
      extras,
      images,
    };
  };

  const normalizedRooms = rooms.map(normalizeRoom);

  const room =
    normalizedRooms.find((item) => String(item.slug).trim() === String(slug).trim()) ||
    normalizedRooms.find((item) => String(item.id).trim() === String(slug).trim()) ||
    null;

  const deleteRoom = async () => {
    if (!room) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    try {
      await remove(ref(db, `hotels/${room.id}`));
      alert("Room deleted successfully!");
      navigate("/rooms");
    } catch (error) {
      alert("Failed to delete room.");
      console.error(error);
    }
  };

  if (!rooms.length) {
    return (
      <>
        <Navbar />
        <div className="container roomerror" style={{ marginTop: "120px" }}>
          <div className="row my-5">
            <div className="col-md-6 col-12 mx-auto">
              <div className="card shadow-lg border-0 p-4 error">
                <h1 className="text-center display-4">Loading...</h1>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <div className="container roomerror" style={{ marginTop: "120px" }}>
          <div className="row my-5">
            <div className="col-md-6 col-12 mx-auto">
              <div className="card shadow-lg border-0 p-4 error">
                <h1 className="text-center display-4">SORRY</h1>
                <h3>No such room could be found...</h3>
                <Link to="/rooms" className="btn btn-warning mt-4">
                  Back to Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const defaultBcg =
    room.images?.length > 0
      ? room.images
      : [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1350&q=80",
        ];

  return (
    <>
      <Navbar />

      <div style={{ marginTop: "76px" }}>
        <StyledHero img={defaultBcg[0]}>
          <Banner title={`${room.name} room`}>
            <Link to="/rooms" className="btn btn-primary">
              Back To Rooms
            </Link>
          </Banner>
        </StyledHero>

        <section className="single-room container py-5">
          <div className="row">
            {defaultBcg.map((item, index) => (
              <div className="col-md-4 col-12 mx-auto mb-4" key={index}>
                <div className="card border-0 shadow-lg">
                  <img src={item} alt={room.name} className="img-fluid" />
                </div>
              </div>
            ))}
          </div>

          <div className="single-room-info row mt-4">
            <article className="desc col-md-6">
              <h3>Details</h3>
              <p>{room.description}</p>
            </article>

            <article className="info col-md-6">
              <h3>Info</h3>
              <h6>Price : £{Number(room.price || 0).toLocaleString()}</h6>
              <h6>Size : {room.size} SQFT</h6>
              <h6>
                Max Capacity :{" "}
                {room.capacity > 1
                  ? `${room.capacity} People`
                  : `${room.capacity} Person`}
              </h6>
              <h6>{room.pets ? "Pets Allowed" : "No Pets Allowed"}</h6>
              <h6>
                {room.breakfast ? "Free Breakfast Included" : "No Free Breakfast"}
              </h6>
            </article>
          </div>

          <section className="room-extras mt-5">
            <h3>Extras</h3>
            {room.extras.length > 0 ? (
              <ul className="extras">
                {room.extras.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No extras available</p>
            )}

            <div className="p-4 clearfix">
              <div className="row">
                <div className="col-md-6 col-12 mb-3">
                  <button
                    className="btn btn-outline-danger btn-block btn-lg"
                    onClick={deleteRoom}
                  >
                    Delete Room.
                  </button>
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <Link
                    to={`/update-room/${room.slug}`}
                    className="btn btn-outline-primary btn-block btn-lg"
                  >
                    Update Room.
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default SingleRooms;