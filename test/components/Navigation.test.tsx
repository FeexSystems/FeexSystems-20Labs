import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../../client/components/Navigation';

// Mock authentication context
vi.mock('../../client/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  })
}));

describe('Navigation Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders navigation links correctly', () => {
    renderWithRouter(
      <Navigation 
        activeSection="home"
        onSectionChange={() => {}}
      />
    );
    
    const homeLink = screen.getByText(/home/i);
    const pricingLink = screen.getByText(/pricing/i);
    const aboutLink = screen.getByText(/about/i);
    
    expect(homeLink).toBeDefined();
    expect(pricingLink).toBeDefined();
    expect(aboutLink).toBeDefined();
  });

  it('shows login/register buttons when not authenticated', () => {
    renderWithRouter(
      <Navigation 
        activeSection="home"
        onSectionChange={() => {}}
      />
    );
    
    const loginButton = screen.getByText(/login/i);
    const signupButton = screen.getByText(/sign up/i);
    
    expect(loginButton).toBeDefined();
    expect(signupButton).toBeDefined();
  });

  it('handles mobile menu toggle', () => {
    renderWithRouter(
      <Navigation 
        activeSection="home"
        onSectionChange={() => {}}
      />
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeDefined();
    
    // Mobile menu should be hidden initially
    const mobileMenu = screen.getByRole('navigation', { hidden: true });
    expect(mobileMenu.getAttribute('aria-hidden')).toBe('true');
    
    // Click menu button
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible
    expect(mobileMenu.getAttribute('aria-hidden')).toBe('false');
  });
});
