import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import axios from "axios";
export default function EditProfieInfo() {
  const { user: currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    city: currentUser.city,
    from: currentUser.from,
  });

  const { userId } = useParams();
  console.log(userId);
  function updateInfo(e) {
    e.preventDefault();
    axios
      .post(`http://localhost:8800/api/users/updateProfile`, {
        userId: currentUser._id,
        data: {
          city: formData.city,
          from: formData.from,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ textAlign: "center", fontStyle: "italic" }}>user info</h1>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            value={formData.city}
            type="text"
            placeholder="City"
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.target.value,
              })
            }
          />
          <input
            value={formData.from}
            type="text"
            placeholder="From"
            onChange={(e) =>
              setFormData({
                ...formData,
                from: e.target.value,
              })
            }
          />
          <button onClick={(e) => updateInfo(e)} style={{ cursor: "pointer" }}>
            save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
