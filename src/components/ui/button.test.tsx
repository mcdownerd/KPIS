import { render, screen } from '@testing-library/react';
import { Button } from './button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
    test('renders button with text', () => {
        render(<Button>Click me</Button>);
        const buttonElement = screen.getByText(/click me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('renders button as disabled when disabled prop is passed', () => {
        render(<Button disabled>Click me</Button>);
        const buttonElement = screen.getByText(/click me/i);
        expect(buttonElement).toBeDisabled();
    });
});
