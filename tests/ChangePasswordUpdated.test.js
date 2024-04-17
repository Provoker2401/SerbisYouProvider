import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ChangePasswordUpdated from "../screens/ChangePasswordUpdated";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));



describe("ChangePasswordUpdated component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<ChangePasswordUpdated/>);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } =  render(<ChangePasswordUpdated/>);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Your password has been updated!");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } =  render(<ChangePasswordUpdated/>);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Sign In");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("Pressing the Wallet navigates to Wallet screen", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } =  render(<ChangePasswordUpdated/>);

    // Find the Pressable element by its text content
    const button = getByText("Sign In");

    // Simulate a press event on the Pressable element
    fireEvent.press(button);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
