import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ForgotPasswordUpdated from "../screens/ForgotPasswordUpdated";
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

describe("ForgotPasswordUpdated component", () => {
  test("renders", () => {
    // Render the component with mocked route params
    render(<ForgotPasswordUpdated />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ForgotPasswordUpdated />);

    const text = getByText(
      "Your password has been changed! You can now login your account."
    );
    const text1 = getByText("Congratulations");
    const text2 = getByText("Sign In");

    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
  });

  test("Pressing the SignIn navigates to SignIn subcategory", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByTestId } = render(<ForgotPasswordUpdated />);

    // Find the Pressable element by its text content
    const button = getByTestId("sign-in-button");

    // Simulate a press event on the Pressable element
    fireEvent.press(button);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
