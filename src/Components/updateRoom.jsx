import { ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const UpdateRoom = () => {
  const { slug } = useParams();
  const state = useSelector((state) => state);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, settype] = useState("");
  const [price, setprice] = useState(0);
  const [size, setsize] = useState(0);
  const [capacity, setcapacity] = useState(1);
  const [pets, setpets] = useState(false);
  const [breakfast, setbreakfast] = useState(false);
  const [description, setdescription] = useState("");
  const [extras, setextras] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

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
      name: fields?.name || roomObj?.name || "",
      type: fields?.type || roomObj?.type || "",
      price: Number(fields?.price || roomObj?.price || 0),
      size: Number(fields?.size || roomObj?.size || 0),
      capacity: Number(fields?.capacity || roomObj?.capacity || 1),
      pets: Boolean(fields?.pets ?? roomObj?.pets),
      breakfast: Boolean(fields?.breakfast ?? roomObj?.breakfast),
      description: fields?.description || roomObj?.description || "",
      extras,
      images,
    };
  };

  const normalizedRooms = rooms.map(normalizeRoom);

  const room =
    normalizedRooms.find((roomItem) => String(roomItem.slug).trim() === String(slug).trim()) ||
    normalizedRooms.find((roomItem) => String(roomItem.id).trim() === String(slug).trim()) ||
    null;

  const id = room?.id;
  const currentSlug = room?.slug || slug;

  useEffect(() => {
    if (room) {
      setName(room.name || "");
      settype(room.type || "");
      setprice(room.price || 0);
      setsize(room.size || 0);
      setcapacity(room.capacity || 1);
      setpets(room.pets || false);
      setbreakfast(room.breakfast || false);
      setdescription(room.description || "");
      setextras(Array.isArray(room.extras) ? room.extras.join(", ") : "");
      setImage1(room.images?.[0] || "");
      setImage2(room.images?.[1] || "");
      setImage3(room.images?.[2] || "");
      setImage4(room.images?.[3] || "");
    }
  }, [room]);

  async function updateRoomFirebase() {
    if (
      name &&
      type &&
      price &&
      size &&
      description &&
      extras &&
      image1 &&
      image2 &&
      image3 &&
      image4
    ) {
      try {
        await update(ref(db, `hotels/${id}`), {
          sys: {
            id,
          },
          fields: {
            name,
            slug: currentSlug, // keep the same slug
            type,
            price: Number(price),
            size: Number(size),
            capacity: Number(capacity),
            pets,
            breakfast,
            featured: false,
            description,
            extras: extras
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            images: [
              {
                fields: {
                  file: {
                    url: image1,
                  },
                },
              },
              {
                fields: {
                  file: {
                    url: image2,
                  },
                },
              },
              {
                fields: {
                  file: {
                    url: image3,
                  },
                },
              },
              {
                fields: {
                  file: {
                    url: image4,
                  },
                },
              },
            ],
          },
        });

        alert("Room updated!");
        navigate(`/rooms/${currentSlug}`);
      } catch (error) {
        alert("Failed to update room.");
        console.error(error);
      }
    } else {
      alert("Please fill all required fields.");
    }
  }

  return (
    <>
      <Navbar />

      {slug && room ? (
        <div className="container my-5" style={{ marginTop: "120px" }}>
          <div className="row">
            <div className="col-md-10 mx-auto col-12 card shadow-lg border-0 p-4">
              <div>
                <h1 className="display-4 text-center">Update Room</h1>
              </div>

              <div className="row my-4">
                <div className="col-md-12 col-12 my-auto">
                  <div className="col-md-12 col-12 float-right">
                    <form>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          id="name"
                          placeholder="Room name."
                          required
                        />

                        <label htmlFor="type">Type</label>
                        <input
                          type="text"
                          className="form-control"
                          value={type}
                          onChange={(e) => settype(e.target.value)}
                          id="type"
                          placeholder="Room type"
                          required
                        />

                        <label htmlFor="price">Price</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setprice(e.target.value)}
                          className="form-control"
                          required
                          id="price"
                          placeholder="Room price"
                        />

                        <label htmlFor="size">Size</label>
                        <input
                          type="number"
                          className="form-control"
                          value={size}
                          onChange={(e) => setsize(e.target.value)}
                          required
                          id="size"
                          placeholder="Room Size"
                        />

                        <label htmlFor="capacity">Capacity</label>
                        <input
                          type="number"
                          value={capacity}
                          onChange={(e) => setcapacity(e.target.value)}
                          className="form-control"
                          required
                          id="capacity"
                          placeholder="Capacity"
                        />

                        <div className="custom-control custom-checkbox my-1">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            checked={breakfast}
                            onChange={() => setbreakfast(!breakfast)}
                            name="breakfast"
                            id="breakfast"
                          />
                          <label htmlFor="breakfast" className="custom-control-label">
                            Breakfast
                          </label>
                        </div>

                        <div className="custom-control custom-checkbox my-1">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="pets"
                            checked={pets}
                            onChange={() => setpets(!pets)}
                            id="pets"
                          />
                          <label htmlFor="pets" className="custom-control-label">
                            Pets
                          </label>
                        </div>

                        <label htmlFor="description">Description</label>
                        <textarea
                          className="form-control"
                          value={description}
                          onChange={(e) => setdescription(e.target.value)}
                          id="description"
                          placeholder="Short description of room."
                          rows="3"
                        ></textarea>

                        <label htmlFor="extras">Extras</label>
                        <textarea
                          className="form-control"
                          value={extras}
                          onChange={(e) => setextras(e.target.value)}
                          id="extras"
                          placeholder="Separated by comma ( , )"
                          rows="3"
                        ></textarea>

                        <label htmlFor="img1">Image 1</label>
                        <input
                          type="text"
                          value={image1}
                          onChange={(e) => setImage1(e.target.value)}
                          className="form-control"
                          id="img1"
                          placeholder="Image 1 URL"
                          required
                        />

                        <label htmlFor="img2">Image 2</label>
                        <input
                          type="text"
                          className="form-control"
                          value={image2}
                          onChange={(e) => setImage2(e.target.value)}
                          id="img2"
                          placeholder="Image 2 URL"
                          required
                        />

                        <label htmlFor="img3">Image 3</label>
                        <input
                          type="text"
                          value={image3}
                          onChange={(e) => setImage3(e.target.value)}
                          className="form-control"
                          id="img3"
                          placeholder="Image 3 URL"
                          required
                        />

                        <label htmlFor="img4">Image 4</label>
                        <input
                          type="text"
                          value={image4}
                          onChange={(e) => setImage4(e.target.value)}
                          className="form-control"
                          id="img4"
                          placeholder="Image 4 URL"
                          required
                        />
                      </div>
                    </form>

                    <button
                      className="btn btn-block btn-outline-primary"
                      onClick={updateRoomFirebase}
                    >
                      UPDATE ROOM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container roomerror" style={{ marginTop: "120px" }}>
          <div className="row my-5">
            <div className="col-md-6 col-12 mx-auto">
              <div className="card shadow-lg border-0 p-4 error">
                <h1 className="text-center display-4">Update</h1>
                <h3>Please select room from Room page..</h3>
                <Link to="/rooms" className="btn btn-warning mt-4">
                  Back to Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateRoom;