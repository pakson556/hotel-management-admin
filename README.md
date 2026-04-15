# Hotel Management DApp

A Hybrid Blockchain Hotel Management System built for **CN6035 – Mobile and Distributed Systems** at the University of East London.

## Features

- Room browsing, filtering, and booking
- Admin panel to manage rooms, users, and bookings
- Payments via Credit/Debit Card, PayPal, or MetaMask
- Every booking creates an on-chain proof on Ethereum Sepolia TestNet
- Admin approval workflow for all bookings

## Tech Stack

**Client:** React, Redux, Bootstrap, Styled Components

**Server:** Firebase Realtime Database, Firebase Authentication

**Blockchain:** Solidity 0.8.20, Hardhat v3, ethers.js v6, Ethereum Sepolia TestNet

## Demo Credentials

**Admin Login**
- Email: admin@hotel.com
- Password: admin123

**User Login**
- Email: Pakson@gmail.com
- Password: pakson123

## Run Locally

Clone the project

```bash
git clone https://github.com/your-repo/hotel-management-admin.git
```

Go to the project directory

```bash
cd hotel-management-admin
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm start
```

## Blockchain

Install blockchain dependencies

```bash
cd blockchain && npm install
```

Deploy smart contract to Sepolia

```bash
cd blockchain && npx hardhat run scripts/deploy.js --network sepolia
```

## Acknowledgements

Forked and extended from the original project by [Nabia-Sheikh](https://github.com/Nabia-Sheikh/hotel-management-admin).
