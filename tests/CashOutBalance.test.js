import React from "react";
import { render, fireEvent} from "@testing-library/react-native";
import CashOutBalance from "../screens/CashOutBalance";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const routeParams = {
  params: {
    shortUserID: "test",
  },
};

describe("ApplicationForm1 component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<CashOutBalance route={routeParams} />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<CashOutBalance route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Refer to your user ID to complete the payment");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<CashOutBalance route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("User ID");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<CashOutBalance route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Back to Wallet");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("Pressing the Wallet navigates to Wallet screen", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByText } = render(<CashOutBalance route={routeParams} />);

    // Find the Pressable element by its text content
    const button = getByText("Back to Wallet");

    // Simulate a press event on the Pressable element
    fireEvent.press(button);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith("Wallet");
  });
});
