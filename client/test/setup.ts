import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// Mock DOM environment setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch globally
global.fetch = vi.fn();

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Global test setup
beforeAll(() => {
  // Setup any global test configuration
});

afterAll(() => {
  // Cleanup after all tests
});