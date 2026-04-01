import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
    ],
    name: "cancelBooking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bookingCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "checkIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "checkOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "guests",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "bookingRef",
        type: "string",
      },
    ],
    name: "bookRoom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
    ],
    name: "getBooking",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "bookingId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roomId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "checkIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "checkOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "guests",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "guestWallet",
            type: "address",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "bookingRef",
            type: "string",
          },
        ],
        internalType: "struct HotelBooking.Booking",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyBookingIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guestWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cancelledAt",
        type: "uint256",
      },
    ],
    name: "BookingCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "bookingId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roomId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guestWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "bookingRef",
        type: "string",
      },
    ],
    name: "RoomBooked",
    type: "event",
  },
];

export const LOCAL_CHAIN_CONFIG = {
  chainId: "0x7A69",
  chainName: "Hardhat Localhost 8545",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: [],
};

export function calculateBlockchainAmountEth(totalPriceGbp) {
  const numericTotal = Number(totalPriceGbp || 0);
  const converted = numericTotal / 10000;
  return Math.max(converted, 0.001).toFixed(4);
}

export function toUnixTimestamp(dateValue) {
  return Math.floor(new Date(dateValue).getTime() / 1000);
}

export async function ensureMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it first.");
  }
}

export async function switchToLocalNetwork() {
  await ensureMetaMask();

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: LOCAL_CHAIN_CONFIG.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [LOCAL_CHAIN_CONFIG],
      });
    } else {
      throw switchError;
    }
  }
}

export async function connectWallet() {
  await ensureMetaMask();
  await switchToLocalNetwork();

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No MetaMask account found.");
  }

  return accounts[0];
}

export async function getContractWithSigner() {
  await connectWallet();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return { provider, signer, account, contract };
}

export async function bookRoomOnChain({
  roomId,
  checkIn,
  checkOut,
  guests,
  bookingRef,
  totalPriceGbp,
}) {
  const { provider, account, contract } = await getContractWithSigner();

  const valueEth = calculateBlockchainAmountEth(totalPriceGbp);
  const tx = await contract.bookRoom(
    Number(roomId),
    toUnixTimestamp(checkIn),
    toUnixTimestamp(checkOut),
    Number(guests),
    bookingRef,
    {
      value: ethers.parseEther(valueEth),
    }
  );

  const receipt = await tx.wait();
  const network = await provider.getNetwork();

  let blockchainBookingId = "";
  let emittedBookingRef = bookingRef;

  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed && parsed.name === "RoomBooked") {
        blockchainBookingId = parsed.args.bookingId.toString();
        emittedBookingRef = parsed.args.bookingRef;
        break;
      }
    } catch (error) {
      // ignore unrelated logs
    }
  }

  return {
    method: "metamask",
    status: "success",
    walletAddress: account,
    transactionId: receipt.hash,
    blockchainTxHash: receipt.hash,
    blockchainBookingId,
    contractAddress: CONTRACT_ADDRESS,
    bookingReference: emittedBookingRef,
    blockchainAmountEth: valueEth,
    chainId: Number(network.chainId),
  };
}