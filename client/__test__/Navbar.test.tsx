import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../src/components/Navbar';
import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('Navbar Component', () => {
  it('renders Navbar with correct initial elements', () => {
    render(
      <ChakraProvider>
        <Navbar />
      </ChakraProvider>,
    );

    // Check that the Daily Tasks text is rendered
    expect(screen.getByText('Daily Tasks')).toBeInTheDocument();

    // Check that the images are rendered
    const images = screen.getAllByAltText('logo');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', '/react.png');
    expect(images[1]).toHaveAttribute('src', '/go.png');
    expect(images[2]).toHaveAttribute('src', '/explode.png');

    // Check the toggle button is present
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles color mode on button click', () => {
    render(
      <ChakraProvider>
        <Navbar />
      </ChakraProvider>,
    );

    const toggleButton = screen.getByRole('button');

    // Initially, the color mode icon should be IoMoon
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    // Simulate a click to toggle color mode
    fireEvent.click(toggleButton);

    // After toggle, the color mode icon should be LuSun
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });
});
