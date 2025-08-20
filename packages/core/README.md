# Core Package

This package contains the core functionality for the HumanWallet project, including Ethereum interactions, WebAuthn key management, and domain-driven architecture.

## Testing

The package uses [Vitest](https://vitest.dev/) for unit testing with comprehensive coverage.

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite provides comprehensive coverage for all functions:

- **deleteWebAuthenticationKey**: Tests successful deletion and error handling
- **setWebAuthenticationKey**: Tests successful storage and error handling
- **getWebAuthenticationKey**: Tests successful retrieval, undefined cases, and error handling
- **generateWebAuthenticationKey**: Tests successful generation, error handling, different modes, and config variations

### Mocking Strategy

- **idb-keyval**: Mocked to avoid IndexedDB dependencies in tests
- **@zerodev/webauthn-key**: Mocked to isolate the function logic from external library behavior

### Test Structure

Tests are organized using the AAA pattern (Arrange, Act, Assert) and include:

- Happy path scenarios
- Error handling scenarios
- Edge cases
- Parameter validation

## Available Scripts

- `build`: Build the package using tsup
- `watch-build`: Build in watch mode
- `lint`: Run ESLint with auto-fix
- `typecheck`: Run TypeScript type checking
- `test`: Run tests in watch mode
- `test:run`: Run tests once
- `test:coverage`: Run tests with coverage report
