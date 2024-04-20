import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ForgotPasswordConfirmation1 from "../screens/ForgotPasswordConfirmation1";
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
    render(<ForgotPasswordConfirmation1 />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ForgotPasswordConfirmation1 />);

    const text = getByText("Reset Password");
    const text1 = getByText(" To get your new password, please enter your phone number down below and we will send an OTP on that number for confirmation");
    const text2 = getByText("Email");
    const text3 = getByText("Send");




    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeTruthy();


  });
});
