// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HotelBooking {
    address public owner;
    uint256 public bookingCount;

    struct Booking {
        uint256 bookingId;
        uint256 roomId;
        uint256 totalPrice;
        uint256 checkIn;
        uint256 checkOut;
        uint256 guests;
        address guestWallet;
        bool active;
        uint256 createdAt;
        string bookingRef;
    }

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) private userBookingIds;

    event RoomBooked(
        uint256 indexed bookingId,
        uint256 indexed roomId,
        address indexed guestWallet,
        uint256 totalPrice,
        string bookingRef
    );

    event BookingCancelled(
        uint256 indexed bookingId,
        address indexed guestWallet,
        uint256 cancelledAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyBookingOwner(uint256 bookingId) {
        require(bookings[bookingId].guestWallet == msg.sender, "Not your booking");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function bookRoom(
        uint256 roomId,
        uint256 checkIn,
        uint256 checkOut,
        uint256 guests,
        string calldata bookingRef
    ) external payable returns (uint256) {
        require(roomId > 0, "Invalid room ID");
        require(checkOut > checkIn, "Invalid dates");
        require(guests > 0, "Guests must be at least 1");
        require(msg.value > 0, "Payment required");
        require(bytes(bookingRef).length > 0, "Booking reference required");

        bookingCount++;

        bookings[bookingCount] = Booking({
            bookingId: bookingCount,
            roomId: roomId,
            totalPrice: msg.value,
            checkIn: checkIn,
            checkOut: checkOut,
            guests: guests,
            guestWallet: msg.sender,
            active: true,
            createdAt: block.timestamp,
            bookingRef: bookingRef
        });

        userBookingIds[msg.sender].push(bookingCount);

        emit RoomBooked(
            bookingCount,
            roomId,
            msg.sender,
            msg.value,
            bookingRef
        );

        return bookingCount;
    }

    function cancelBooking(uint256 bookingId) external onlyBookingOwner(bookingId) {
        require(bookings[bookingId].bookingId != 0, "Booking not found");
        require(bookings[bookingId].active, "Booking already cancelled");

        bookings[bookingId].active = false;

        emit BookingCancelled(bookingId, msg.sender, block.timestamp);
    }

    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        require(bookings[bookingId].bookingId != 0, "Booking not found");
        return bookings[bookingId];
    }

    function getMyBookingIds() external view returns (uint256[] memory) {
        return userBookingIds[msg.sender];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}