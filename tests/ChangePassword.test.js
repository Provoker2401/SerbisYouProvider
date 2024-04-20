import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ChangePassword from "../screens/ChangePassword";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
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

describe("ChangePassword component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<ChangePassword />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ChangePassword />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Set your new password");
    const text1 = getByText(
      "Your new password must be different from previous used password"
    );

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
  });

  test("renders does not match the current password correctly", () => {
    // Render the component
    const { getByText } = render(<ChangePassword />);

    // Check if the text "Cardholder’s Name" is rendered
    const text1 = getByText("Change");

    // Assert that the text is present in the component
    expect(text1).toBeTruthy();
  });

  test("renders TextInput with placeholder and EyeOff icon", () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangePassword />);

    // Check if TextInput is rendered with the correct placeholder
    const textInput = getByPlaceholderText("Current Password");
    expect(textInput).toBeDefined();

    // Check if EyeOff icon is rendered
    const eyeOffIcon = getByTestId("eye-off-icon");
    expect(eyeOffIcon).toBeDefined();
  });

  test("renders TextInput with placeholder and EyeOff icon", () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangePassword />);

    // Check if TextInput is rendered with the correct placeholder
    const textInput = getByPlaceholderText("Enter Your New Password");
    expect(textInput).toBeDefined();

    // Check if EyeOff icon is rendered
    const eyeOffIcon = getByTestId("eye-off-icon2");
    expect(eyeOffIcon).toBeDefined();
  });

  test("renders TextInput with placeholder and EyeOff icon", () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangePassword />);

    // Check if TextInput is rendered with the correct placeholder
    const textInput = getByPlaceholderText("Confirm New Password");
    expect(textInput).toBeDefined();

    // Check if EyeOff icon is rendered
    const eyeOffIcon = getByTestId("eye-off-icon3");
    expect(eyeOffIcon).toBeDefined();
  });

});
