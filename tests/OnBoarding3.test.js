import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Onboarding3 from "../screens/Onboarding3";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("ChangePasswordUpdated component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<Onboarding3 />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<Onboarding3 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Your key to home service success");
    const text2 = getByText(
      "We're more than just an app; we're your pathway to success."
    );
    const text3 = getByText("Get Started");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeTruthy();
  });

  test("Pressing the button navigates to next screen", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByTestId } = render(<Onboarding3 />);

    // Find the Pressable element by its text content
    const button = getByTestId("next-button");

    // Simulate a press event on the Pressable element
    fireEvent.press(button);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("SignIn");
  });
});
