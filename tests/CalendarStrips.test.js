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
  
});
