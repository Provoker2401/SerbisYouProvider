import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ForgotPasswordResendCode from "../screens/ForgotPasswordResendCode";
import { useNavigation } from "@react-navigation/native";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mocking Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  currentUser: { uid: "mockedUserId" }, // Mocking auth.currentUser
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("ForgotPasswordCode component", () => {
  test("renders with mock values", () => {
    // Render the component with mocked route params
    render(<ForgotPasswordResendCode />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ForgotPasswordResendCode />);

    const text = getByText("Code has been sent to 09** *** ****");
    const text1 = getByText("0:20");
    const text2 = getByText("Verify");

    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
  });
});
