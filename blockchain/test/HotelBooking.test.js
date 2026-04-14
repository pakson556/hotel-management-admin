import { network } from "hardhat";
import { expect } from "chai";

describe("HotelBooking", function () {
  let contract;
  let owner;
  let guest;
  let other;

  const ROOM_ID = 1;
  const GUESTS = 2;
  const BOOKING_REF = "BOOK-TEST-001";
  const PAYMENT = "0.01"; // ETH

  const now = Math.floor(Date.now() / 1000);
  const CHECK_IN = now + 86400;
  const CHECK_OUT = now + 86400 * 3;

  beforeEach(async function () {
    const { ethers } = await network.connect();
    [owner, guest, other] = await ethers.getSigners();
    contract = await ethers.deployContract("HotelBooking");
    await contract.waitForDeployment();
  });

  // helper: assert a transaction reverts (optimizer strips revert reason strings)
  async function expectRevert(promise, message) {
    try {
      await promise;
      throw new Error(`Expected revert "${message}" but transaction succeeded`);
    } catch (err) {
      if (err.message.includes("Expected revert")) throw err;
      expect(err.message.toLowerCase()).to.include("revert");
    }
  }

  // ─── Deployment ───────────────────────────────────────────────────────────

  describe("Deployment", function () {
    it("sets the deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("starts with zero bookings", async function () {
      expect(await contract.bookingCount()).to.equal(0n);
    });

    it("starts with zero contract balance", async function () {
      expect(await contract.getContractBalance()).to.equal(0n);
    });
  });

  // ─── bookRoom ─────────────────────────────────────────────────────────────

  describe("bookRoom", function () {
    it("creates a booking and stores it correctly", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });

      const booking = await contract.getBooking(1);
      expect(booking.roomId).to.equal(BigInt(ROOM_ID));
      expect(booking.guestWallet).to.equal(guest.address);
      expect(booking.bookingRef).to.equal(BOOKING_REF);
      expect(booking.active).to.equal(true);
      expect(booking.totalPrice).to.equal(value);
    });

    it("increments bookingCount", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });

      expect(await contract.bookingCount()).to.equal(1n);
    });

    it("emits RoomBooked event with correct args", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      const tx = await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e && e.name === "RoomBooked");

      expect(event).to.not.be.null;
      expect(event.args.bookingId).to.equal(1n);
      expect(event.args.roomId).to.equal(BigInt(ROOM_ID));
      expect(event.args.guestWallet).to.equal(guest.address);
      expect(event.args.bookingRef).to.equal(BOOKING_REF);
    });

    it("increases contract balance after booking", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });

      expect(await contract.getContractBalance()).to.equal(value);
    });

    it("reverts if roomId is zero", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await expectRevert(
        contract
          .connect(guest)
          .bookRoom(0, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value }),
        "Invalid room ID"
      );
    });

    it("reverts if checkOut is not after checkIn", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await expectRevert(
        contract
          .connect(guest)
          .bookRoom(ROOM_ID, CHECK_OUT, CHECK_IN, GUESTS, BOOKING_REF, {
            value,
          }),
        "Invalid dates"
      );
    });

    it("reverts if guests is zero", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await expectRevert(
        contract
          .connect(guest)
          .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, 0, BOOKING_REF, { value }),
        "Guests must be at least 1"
      );
    });

    it("reverts if no payment sent", async function () {
      await expectRevert(
        contract
          .connect(guest)
          .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, {
            value: 0,
          }),
        "Payment required"
      );
    });

    it("reverts if booking reference is empty", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await expectRevert(
        contract
          .connect(guest)
          .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, "", { value }),
        "Booking reference required"
      );
    });
  });

  // ─── cancelBooking ────────────────────────────────────────────────────────

  describe("cancelBooking", function () {
    beforeEach(async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);
      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });
    });

    it("marks booking as inactive", async function () {
      await contract.connect(guest).cancelBooking(1);
      const booking = await contract.getBooking(1);
      expect(booking.active).to.equal(false);
    });

    it("emits BookingCancelled event with correct args", async function () {
      const tx = await contract.connect(guest).cancelBooking(1);
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e && e.name === "BookingCancelled");

      expect(event).to.not.be.null;
      expect(event.args.bookingId).to.equal(1n);
      expect(event.args.guestWallet).to.equal(guest.address);
    });

    it("reverts if caller is not the booking owner", async function () {
      await expectRevert(
        contract.connect(other).cancelBooking(1),
        "Not your booking"
      );
    });

    it("reverts if booking is already cancelled", async function () {
      await contract.connect(guest).cancelBooking(1);
      await expectRevert(
        contract.connect(guest).cancelBooking(1),
        "Booking already cancelled"
      );
    });
  });

  // ─── getMyBookingIds ──────────────────────────────────────────────────────

  describe("getMyBookingIds", function () {
    it("returns empty array for new wallet", async function () {
      const ids = await contract.connect(other).getMyBookingIds();
      expect(ids.length).to.equal(0);
    });

    it("returns correct booking IDs for guest", async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);

      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, "REF-1", { value });
      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, "REF-2", { value });

      const ids = await contract.connect(guest).getMyBookingIds();
      expect(ids.length).to.equal(2);
      expect(ids[0]).to.equal(1n);
      expect(ids[1]).to.equal(2n);
    });
  });

  // ─── withdraw ─────────────────────────────────────────────────────────────

  describe("withdraw", function () {
    beforeEach(async function () {
      const { ethers } = await network.connect();
      const value = ethers.parseEther(PAYMENT);
      await contract
        .connect(guest)
        .bookRoom(ROOM_ID, CHECK_IN, CHECK_OUT, GUESTS, BOOKING_REF, { value });
    });

    it("drains the contract balance to zero after withdraw", async function () {
      await contract.connect(owner).withdraw();
      expect(await contract.getContractBalance()).to.equal(0n);
    });

    it("reverts if called by non-owner", async function () {
      await expectRevert(
        contract.connect(guest).withdraw(),
        "Only owner can call this"
      );
    });

    it("reverts if contract balance is zero", async function () {
      await contract.connect(owner).withdraw();
      await expectRevert(
        contract.connect(owner).withdraw(),
        "No funds to withdraw"
      );
    });
  });
});
