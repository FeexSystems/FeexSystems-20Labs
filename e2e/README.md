# E2E Testing Guide

This project uses Playwright for end-to-end testing. The tests are located in the `e2e` directory.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

- Run all E2E tests:
```bash
npm run test:e2e
```

- Run tests with UI mode:
```bash
npm run test:e2e:ui
```

- Run specific test file:
```bash
npx playwright test e2e/auth.spec.ts
```

- Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

## Test Structure

- `e2e/helpers/test-helpers.ts`: Common helper functions
- `e2e/auth.spec.ts`: Authentication flow tests
- `e2e/navigation.spec.ts`: Navigation and layout tests

## Writing Tests

1. Use data-testid attributes for element selection:
```html
<button data-testid="login-button">Login</button>
```

2. Use helper functions from `test-helpers.ts`:
```typescript
const helpers = new TestHelpers(page);
await helpers.login('user@example.com', 'password');
```

3. Follow the page object pattern for complex pages:
```typescript
class DashboardPage {
  constructor(private page: Page) {}
  
  async navigateToSection(section: string) {
    await this.page.click(`[data-testid="section-${section}"]`);
  }
}
```

## Best Practices

1. Keep tests independent
2. Clean up test data after tests
3. Use meaningful test descriptions
4. Group related tests using `test.describe`
5. Add appropriate assertions
6. Handle async operations properly
7. Use test hooks (beforeEach, afterEach) for setup/cleanup

## Debugging

- Use `page.pause()` to pause test execution
- Use `--debug` flag for step-by-step debugging
- Check screenshots and videos in test-results/ directory
- Use UI mode for visual debugging
