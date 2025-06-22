# Playwright Automation Testing

This project contains UI and API automation tests using Playwright.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Java

## Installation

Clone the repository:

```bash
git clone https://github.com/bibas07/playwright-automation-testing.git
cd playwright-automation-testing

Install the dependencies:
npm install

Running Tests
UI Tests for specific file
To run the UI tests (form and table operations):
npx playwright test uiTests/formTests.spec.ts
npx playwright test uiTests/tableTests.spec.ts

To run the UI tests
npm run test:web:ui (for UI mode)
npm run test:web:ci (for CI mode)

API Tests
To run the API tests (books API):
npx playwright test apiTests/booksApiTests.spec.ts
npm run test:api (for API testing)


Generate Allure Report (Locally)
npm run test:report

Notes
Ensure your environment has the required dependencies installed.


The tests use Playwright's native test API and should work seamlessly on any modern browser.
```
