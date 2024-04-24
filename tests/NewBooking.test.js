import React from "react";
import { render, fireEvent,waitFor } from "@testing-library/react-native";
import NewBooking from "../screens/NewBooking";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock for firebase/firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));

const routeParams = {
  params: {
    name: "John Doe",
    userBookingID: "j12321",
    matchedBookingID: "1234567890",
    bookingIndex: "1",
    providerCoordinates: "10",
  },
};
describe("New Booking Screen", () => {
  test("renders without errors", () => {
    render(<NewBooking route={routeParams} />);
  });

});
