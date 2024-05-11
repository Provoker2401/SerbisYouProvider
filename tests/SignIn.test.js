import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";

import SignIn from "../screens/SignIn";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// Mock Firebase imports
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(), // Mock the show function
}));

const mockAuth = {
  getAuth: jest.fn(),
};

describe("SignIn", () => {
  test("renders without errors", () => {
    render(<SignIn />);
  });

  test("should handle sign-in success with valid email and password", async () => {
    // Mock the behavior of signInWithEmailAndPassword
    const mockToastShow = jest.spyOn(Toast, "show").mockImplementation(); // Mock the Toast.show function

    // Mock the user credential object
    const userCredential = {
      user: {
        uid: "user123",
        email: "valid@example.com",
      },
    };

    // Mock the signInWithEmailAndPassword function to succeed
    signInWithEmailAndPassword.mockResolvedValueOnce(userCredential);
    getDoc.mockResolvedValueOnce({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        email: "valid@example.com",
        password: "password",
        phone: "12312312",
      }),
    });
    // Trigger sign-in
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText("email@gmail.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByTestId("signIn");

    fireEvent.changeText(emailInput, "valid@example.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith({
        type: "success",
        position: "top",
        text1: "Sign In Successful",
        text2: "You have successfully signed in✅",
        visibilityTime: 3000,
      });
    });
  });

  test("should handle sign-in failure with invalid email' ", async () => {
    const errorMessage = "Sign In error";
    const mockToastShow = jest.spyOn(Toast, "show").mockImplementation(); // Mock the Toast.show function

    signInWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/invalid-email",
      message: errorMessage,
    });

    const { getByPlaceholderText, queryByText, getByTestId } = render(
      <SignIn />
    );

    const emailInput = getByPlaceholderText("email@gmail.com");
    const passwordInput = getByPlaceholderText("Password");
    const signInButton = getByTestId("signIn");

    fireEvent.changeText(emailInput, "invalid@example.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith({
        type: "error",
        position: "top",
        text1: errorMessage,
        text2: "Wrong email or password❗",
        visibilityTime: 5000,
      });
    });

    mockToastShow.mockRestore();
  });

  test("should handle sign-in success with firestore error", async () => {
    // Mock the behavior of signInWithEmailAndPassword
    const mockToastShow = jest.spyOn(Toast, "show").mockImplementation(); // Mock the Toast.show function

    // Mock Firestore behavior
    getFirestore.mockReturnValueOnce({
      getDoc: jest.fn().mockResolvedValueOnce({
        exists: true,
        data: jest.fn(() => ({
          email: "valid@example.com",
          password: "password",
          phone: "12312312",
        })),
      }),
    });

    // Mock the authentication object
    const mockAuth = {
      getAuth: jest.fn(),
    };

    // Mock the user credential object
    const userCredential = {
      user: {
        uid: "user123",
        email: "valid@example.com",
      },
    };

    // Mock the signInWithEmailAndPassword function to fail
    signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Firestore error")
    );

    // Trigger sign-in
    await render(<SignIn />);
    const emailInput = screen.getByPlaceholderText("email@gmail.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByTestId("signIn");

    fireEvent.changeText(emailInput, "valid@example.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(signInButton);

    // Wait for the expected toast message
    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith({
        type: "error",
        position: "top",
        text1: "Sign In error",
        text2: "Wrong email or password❗",
        visibilityTime: 5000,
      });
    });
  });

  test("renders email input field", () => {
    const { getByPlaceholderText } = render(<SignIn />);
    const email = getByPlaceholderText("email@gmail.com");

    expect(email).toBeTruthy();
  });

  test("updates email input value correctly", () => {
    const { getByPlaceholderText } = render(<SignIn />);
    const input = getByPlaceholderText("email@gmail.com");

    fireEvent.changeText(input, "test@example.com");

    expect(input.props.value).toBe("test@example.com");
  });

  test("renders password input field", () => {
    const { getByPlaceholderText } = render(<SignIn />);
    const password = getByPlaceholderText("Password");

    expect(password).toBeTruthy();
  });

  test("updates password input value correctly", () => {
    const { getByPlaceholderText } = render(<SignIn />);
    const input = getByPlaceholderText("email@gmail.com");

    fireEvent.changeText(input, "12345");

    expect(input.props.value).toBe("12345");
  });

  test("renders all required text elements", () => {
    const { getByText } = render(<SignIn />);

    // Assert text elements
    expect(getByText("Welcome back!")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText("Forgot password?")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("SerbisYou")).toBeTruthy();
    expect(getByText("Create a new Account?")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
  });

  test("displays SerbisYou logo", () => {
    render(<SignIn />);
    expect(screen.getByTestId("serbisyou-logo")).toBeTruthy();
  });
});
