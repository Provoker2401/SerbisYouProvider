import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Onboarding1 from "../screens/Onboarding1";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));



describe("ChangePasswordUpdated component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<Onboarding1/>);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } =  render(<Onboarding1/>);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Skip");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } =  render(<Onboarding1/>);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Connect with potential clients, and take control of your service offerings in one platform");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });



  test("Pressing the button navigates to next screen", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByTestId } =  render(<Onboarding1/>);

    // Find the Pressable element by its text content
    const button = getByTestId("next-button");

    // Simulate a press event on the Pressable element
    fireEvent.press(button);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("Onboarding2");
  });
});
