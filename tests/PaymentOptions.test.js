import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PaymentOPtions from "../screens/PaymentOptions";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";


jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
  }));


describe("Payment Options component", () => {
  test("renders correctly", () => {
    // Render the component
    render(
      <SafeAreaProvider>
        <PaymentOPtions />
      </SafeAreaProvider>
    );
  });
  test('navigates to AddCard screen when pressed', () => {
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // const navigation = { navigate: jest.fn() }; // Create a mock navigation object with a navigate function
    const { getByText } = render(<PaymentOPtions />);
    const pressable = getByText('Cards'); // Assuming 'Cards' is the text inside the Pressable

    fireEvent.press(pressable);

    expect(mockNavigate).toHaveBeenCalledWith("AddCard");
  });
});
