import React from "react";
import { render } from "@testing-library/react-native";
import CalendarStrips from "../screens/CalendarStrips";
import { useNavigation } from "@react-navigation/native";



jest.mock('react-native-calendar-strip', () => 'CalendarStrip');

// Mocking moment
const moment = jest.fn(() => ({
    format: jest.fn(),
    startOf: jest.fn(unit => {
      if (unit === 'year') {
        return moment().startOf('year');
      }
      throw new Error(`Unknown unit ${unit}`);
    }),
    endOf: jest.fn(unit => {
      if (unit === 'year') {
        return moment().endOf('year');
      }
      throw new Error(`Unknown unit ${unit}`);
    }),
    isoWeekday: jest.fn(),
    isBefore: jest.fn(),
    add: jest.fn(),
  }));

describe("CalendarStrips component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<CalendarStrips />);
  });

  test('displays selected date correctly', () => {
    // Generate a date string that's one day behind the current date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() +1);
    const formattedDate = currentDate.toISOString().slice(0, 10); // Format the date as 'YYYY-MM-DD'

    // Render the component
    const { getByText } = render(<CalendarStrips />);
    
    // Find the Text component by its rendered text
    const textElement = getByText(`Selected Date: ${formattedDate}`);
    
    // Assert that the Text component with the formatted date is found
    expect(textElement).toBeTruthy();
  });
});
