import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Splash from '../screens/Splash';

describe('Splash', () => {
  test('renders without errors', () => {
    render(<Splash />);
  });

  test('displays SerbisYou logo', () => {
    render(<Splash />);
    expect(screen.getByTestId('serbisyou-logo')).toBeTruthy();
  });

  test('displays SerbisYou text', () => {
    render(<Splash />);
    expect(screen.getByText('SerbisYou')).toBeTruthy();
  });
  test('displays SerbisYou text', () => {
    render(<Splash />);
    expect(screen.getByText('PROVIDER')).toBeTruthy();
  });

});
