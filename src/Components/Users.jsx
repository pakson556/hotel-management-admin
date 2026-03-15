import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import Navbar from "./Navbar";

const Users = () => {
  const state = useSelector((state) => state);

  return (
    <>
      <Navbar />

      <div style={{ marginTop: "120px" }}>
        {state[1] ? (
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{ width: "80%", margin: "0 auto" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No.</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(state[1]).map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || item.number || "N/A"}</td>
                  <td>{item.isAdmin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Loading message={"Users data loading..."} />
        )}
      </div>
    </>
  );
};

export default Users;