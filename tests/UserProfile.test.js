import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import UserProfile from "../screens/UserProfile";
import { useNavigation } from "@react-navigation/native";

// Mocking firebase/firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mocking firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  currentUser: { uid: "mockedUserId" }, // Mocking auth.currentUser
}));

// Mocking useNavigation hook

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
  }));
  
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe("User Profile component", () => {
  const mockNavigate = jest.fn();
  test("renders correctly", () => {
    render(<UserProfile />);
  });
  test("Pressing the Edit Profile navigates to Edit Profile screen", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const editpressable = getByText("Edit Profile");

    // Simulate a press event on the Pressable element
    fireEvent.press(editpressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("EditProfile");
  });

  test("Pressing the Change password navigates to change password", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const changePressable = getByText("Change Password");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("ChangePassword");
  });



  test("Pressing the Notifiations navigates to Notification", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const changePressable = getByText("Notifications");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("NotificationsSettings");
  });

  test("Pressing the Notifiations navigates to Wallet", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByTestId } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const changePressable = getByTestId("wallet-button");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("Wallet");
  });

  test("Pressing the Help Center navigates to Help Center", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const changePressable = getByText("Help Center");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("HelpCenterFAQ");
  });

  
  test("Pressing the Privacy Policy navigates to Privacy Policy", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<UserProfile />);

    // Find the Pressable element by its text content
    const changePressable = getByText(" Privacy Policy");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("PrivacyPolicy");
  });
});
