import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FaUserShield, FaUser, FaEnvelope, FaPhone, FaIdBadge } from "react-icons/fa";
import Navbar from "./Navbar";
import Loading from "./Loading";

const PageWrapper = styled.div`
  margin-top: 120px;
  padding: 0 2rem 3rem;
  min-height: 100vh;
  background: var(--offWhite);
`;

const PageTitle = styled.h2`
  color: var(--primaryColor);
  margin-bottom: 2rem;
  font-weight: 700;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--lightShadow);
  transition: var(--mainTransition);
  border-left: 6px solid ${(props) => (props.admin ? "#2563eb" : "#9ca3af")};

  &:hover {
    box-shadow: var(--darkShadow);
    transform: translateY(-4px);
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserName = styled.h4`
  margin: 0;
  font-weight: 700;
  color: #222;
`;

const RoleBadge = styled.span`
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-weight: 700;
  background: ${(props) => (props.admin ? "#dbeafe" : "#f3f4f6")};
  color: ${(props) => (props.admin ? "#1d4ed8" : "#374151")};
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const InfoList = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  color: #333;
  word-break: break-word;

  svg {
    color: var(--primaryColor);
    margin-top: 0.15rem;
    flex-shrink: 0;
  }
`;

const Label = styled.span`
  font-weight: 700;
  margin-right: 0.35rem;
`;

const Users = () => {
  const state = useSelector((state) => state);
  const users = state?.[1] ? Object.values(state[1]) : null;

  return (
    <>
      <Navbar />

      <PageWrapper>
        <PageTitle>Users</PageTitle>

        {users ? (
          <UsersGrid>
            {users.map((item) => {
              const isAdmin = Boolean(item.isAdmin);

              return (
                <UserCard key={item.id} admin={isAdmin}>
                  <TopRow>
                    <UserName>{item.name || "Unnamed User"}</UserName>
                    <RoleBadge admin={isAdmin}>
                      {isAdmin ? <FaUserShield /> : <FaUser />}
                      {isAdmin ? "Admin" : "User"}
                    </RoleBadge>
                  </TopRow>

                  <InfoList>
                    <InfoItem>
                      <FaIdBadge />
                      <div>
                        <Label>ID:</Label>
                        {item.id || "N/A"}
                      </div>
                    </InfoItem>

                    <InfoItem>
                      <FaEnvelope />
                      <div>
                        <Label>Email:</Label>
                        {item.email || "N/A"}
                      </div>
                    </InfoItem>

                    <InfoItem>
                      <FaPhone />
                      <div>
                        <Label>Phone:</Label>
                        {item.phone || item.number || "N/A"}
                      </div>
                    </InfoItem>
                  </InfoList>
                </UserCard>
              );
            })}
          </UsersGrid>
        ) : (
          <Loading message={"Users data loading..."} />
        )}
      </PageWrapper>
    </>
  );
};

export default Users;