import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Wallet from "../screens/Wallet";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateEmail: jest.fn(),
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
jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: {
    hasPermission: jest.fn(),
    requestPermission: jest.fn(),
    getToken: jest.fn(),
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(),
    onNotificationOpened: jest.fn(),
  },
}));
const routeParams = {
  params: {
    newDocumentID: "1234567890",
    matchedBookingID: "1",
    providerLocation: "10",
    itemID: "1",
  },
};
describe("ViewBookingDetails", () => {
  test("renders without errors", () => {
    render(<Wallet />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<Wallet />);

    const text = getByText("Current Balance");
    const text1 = getByText("Cash Out");
    const text2 = getByText("Recent Transactions");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
  });
});
