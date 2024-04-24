import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Homepage from "../screens/Homepage";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: "mockedUID",
      },
    })),
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
  onSnapshot: jest.fn(), // Mock onSnapshot function

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
const mockRouteParams = {
    params: {
      bookingAccepted: true,
      bookingAssigned: true,
    },
  };
describe("ViewBookingDetails", () => {
  test("renders without errors", () => {
    render(<Homepage route={mockRouteParams} />);
  });

//   test("renders text correctly", () => {
//     // Render the component
//     const { getByText } = render(<Wallet />);

//     const text = getByText("Current Balance");
//     const text1 = getByText("Cash Out");
//     const text2 = getByText("Recent Transactions");

//     // Assert that the text is present in the component
//     expect(text).toBeTruthy();
//     expect(text1).toBeTruthy();
//     expect(text2).toBeTruthy();
//   });
});
