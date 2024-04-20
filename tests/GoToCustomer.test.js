import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GoToCustomer from "../screens/GoToCustomer";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const mockCurrentUser = { uid: 'mockedUID' };


jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: mockCurrentUser,
  })),
  onAuthStateChanged: jest.fn(),
  updatePassword: jest.fn(),
  EmailAuthProvider: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
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
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
}));

const mockRouteParams = {
  itemID: 1,
  matchedBookingID: 1,
  customerUID: 1,
};

describe("GoToCustomer found component", () => {
  test("renders with mock values", () => {
    // Render the component with mocked route params
    render(<GoToCustomer route={{ params: mockRouteParams }} />);
  });

  //   test("renders text correctly", () => {
  //     // Render the component
  //     const { getByText } = render(
  //       <GoToCustomer route={{ params: mockRouteParams }} />
  //     );

  //     const text = getByText("Service");

  //     expect(text).toBeTruthy();
  //   });
});
