import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ForgotPasswordCode from "../screens/ForgotPasswordCode";
import { useNavigation } from "@react-navigation/native";
import { updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mocking Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateEmail: jest.fn(),
  currentUser: { uid: "mockedUserId" }, // Mocking auth.currentUser
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const itemID = 1;

// Create the mockRouteParams object with the mock values
const mockRouteParams = {
  itemID,
};

describe("ForgotPasswordCode component", () => {
  test("renders with mock values", () => {
    // Render the component with mocked route params
    render(<ForgotPasswordCode />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ForgotPasswordCode />);

    const text = getByText("Enter your OTP code");
    const text1 = getByText("Resend code");
    const text2 = getByText("Verify");



    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();

  });
});
