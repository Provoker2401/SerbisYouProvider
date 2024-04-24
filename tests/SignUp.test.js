import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUp from "../screens/SignUp";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(), // Mock the show function
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));



describe("<SignUp />", () => {
  test("renders without errors", () => {
    render(<SignUp />);
  });

  test("renders all input fields", () => {
    const { getByPlaceholderText } = render(<SignUp />);
    const name = getByPlaceholderText("Full Name");
    const email = getByPlaceholderText("Email");
    const phone = getByPlaceholderText("Phone Number");
    const password = getByPlaceholderText("Password");

    expect(name).toBeTruthy();
    expect(email).toBeTruthy();
    expect(phone).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it("navigates to signIn on button press", () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require("@react-navigation/native"), "useNavigation")
      .mockReturnValue({ navigate: mockNavigate });

    const { getByTestId } = render(<SignUp />);
    fireEvent.press(getByTestId("signIn-btn"));
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });

  test("Please fill in all required fields❗", async () => {
    const mockToastShow = jest.spyOn(Toast, "show").mockImplementation(); // Mock the Toast.show function

    const { getByTestId, getByPlaceholderText } = render(<SignUp />);

    const name = getByPlaceholderText("Full Name");
    const email = getByPlaceholderText("Email");
    const phone = getByPlaceholderText("Phone Number");
    const password = getByPlaceholderText("Password");

    fireEvent.press(getByTestId("signUp-btn"));

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Please fill in all required fields❗",
        visibilityTime: 5000,
      });
    });
  });
  test("Invalid Phone Number Format", async () => {
    const mockToastShow = jest.spyOn(Toast, "show").mockImplementation(); // Mock the Toast.show function

    const { getByTestId, getByPlaceholderText } = render(<SignUp />);

    const name = getByPlaceholderText("Full Name");
    const email = getByPlaceholderText("Email");
    const phone = getByPlaceholderText("Phone Number");
    const password = getByPlaceholderText("Password");

    fireEvent.changeText(name, "John Doe");
    fireEvent.changeText(email, "johndoe@example.com");
    fireEvent.changeText(phone, "1234567890"); // Invalid phone format
    fireEvent.changeText(password, "password");

    fireEvent.press(getByTestId("signUp-btn"));

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Enter a valid 10-digit phone number starting with 9❗",
        visibilityTime: 5000,
      });
    });
  });
});
