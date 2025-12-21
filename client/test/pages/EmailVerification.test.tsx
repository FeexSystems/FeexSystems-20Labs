import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmailVerification from '@/pages/EmailVerification';
import { TestWrapper } from '../utils/test-utils';

// Mock the useAuth hook
const mockVerifyEmail = vi.fn();
const mockResendVerificationEmail = vi.fn();
const mockClearError = vi.fn();
const mockUseAuth = {
  verifyEmail: mockVerifyEmail,
  resendVerificationEmail: mockResendVerificationEmail,
  isLoading: false,
  clearError: mockClearError,
};

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockUseSearchParams()],
  };
});

const TestEmailVerificationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <TestWrapper>
      {children}
    </TestWrapper>
  </BrowserRouter>
);

describe('EmailVerification Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.isLoading = false;
    mockUseSearchParams.mockReturnValue({
      get: vi.fn().mockImplementation((key) => {
        if (key === 'token') return 'valid-token';
        if (key === 'email') return 'user@example.com';
        return null;
      }),
    });
  });

  it('should show loading state initially', () => {
    render(
      <TestEmailVerificationWrapper>
        <EmailVerification />
      </TestEmailVerificationWrapper>
    );

    expect(screen.getByText('Verifying Your Email')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we verify your email address...')).toBeInTheDocument();
  });

  it('should call verifyEmail with token on mount', async () => {
    mockVerifyEmail.mockResolvedValueOnce(undefined);

    render(
      <TestEmailVerificationWrapper>
        <EmailVerification />
      </TestEmailVerificationWrapper>
    );

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith('valid-token');
    });
  });

  it('should show success state after successful verification', async () => {
    mockVerifyEmail.mockResolvedValueOnce(undefined);

    render(
      <TestEmailVerificationWrapper>
        <EmailVerification />
      </TestEmailVerificationWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });
  });
});