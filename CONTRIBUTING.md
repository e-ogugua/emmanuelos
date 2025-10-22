# Contributing to EmmanuelOS

This document outlines the process for contributing to the EmmanuelOS project. Contributions help improve the codebase and add new features while maintaining code quality standards.

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

### Getting Started
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/emmanuelos.git
   cd emmanuelos
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (see README.md)
5. Start the development server:
   ```bash
   npm run dev
   ```

## Contribution Process

### 1. Create a Feature Branch
Always create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b docs/update-documentation
```

### 2. Make Your Changes
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation if needed
- Ensure all existing tests pass

### 3. Test Your Changes
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when available)
npm run test

# Check build
npm run build
```

### 4. Commit Your Changes
Use meaningful commit messages that follow the conventional commit format:
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve responsive layout issue on mobile"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub with a clear description of your changes.

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Avoid `any` types when possible
- Use meaningful interface and type names
- Follow existing naming conventions (camelCase for variables, PascalCase for components)

### React Components
- Use functional components with hooks
- Implement proper memoization for performance
- Include displayName for memoized components
- Use semantic HTML elements
- Follow accessibility best practices

### Styling
- Use Tailwind CSS utility classes
- Follow the established design system
- Maintain consistent spacing using the 8px grid system
- Use semantic color names from the theme

### Performance
- Use React.memo for components that don't need frequent re-renders
- Implement lazy loading for heavy components
- Optimize images with Next.js Image component
- Avoid unnecessary re-renders in component trees

## Project Structure Guidelines

### Component Organization
- Place reusable components in `src/components/`
- Group related components in subdirectories
- Use index files for clean imports
- Document component props and usage

### State Management
- Use React Context for global application state
- Keep local state close to where it's used
- Avoid prop drilling with context or custom hooks
- Implement proper loading and error states

### API Routes
- Follow Next.js App Router conventions
- Use proper HTTP status codes
- Implement error handling and validation
- Document API endpoints

## Testing Requirements

### Unit Tests
- Test component behavior and interactions
- Mock external dependencies
- Test error scenarios
- Aim for high test coverage on new features

### Integration Tests
- Test API routes and database interactions
- Test authentication and authorization flows
- Test form submissions and data persistence

### Performance Tests
- Monitor bundle size impact of changes
- Test loading performance
- Verify accessibility compliance

## Documentation Updates

When adding new features:
- Update README.md if new setup steps are required
- Add inline code comments for complex logic
- Update component documentation in README files
- Document any breaking changes

## Review Process

### Pull Request Requirements
- Clear description of changes and rationale
- Screenshots or demos for UI changes
- Tests for new functionality
- Updated documentation
- No linting errors or type errors

### Code Review Checklist
- [ ] Follows existing code style and conventions
- [ ] Includes proper TypeScript types
- [ ] Has appropriate error handling
- [ ] Maintains performance standards
- [ ] Updates documentation as needed
- [ ] Includes tests for new functionality

## Communication

### Issues and Discussions
- Use GitHub Issues for bug reports and feature requests
- Provide clear reproduction steps for bugs
- Include relevant code snippets and screenshots
- Be respectful and constructive in discussions

### Feature Requests
- Explain the use case and problem being solved
- Consider alternative solutions
- Provide examples of desired behavior
- Be open to implementation suggestions

## License and Attribution

All contributions are subject to the project's license terms. Contributors retain copyright of their original work while granting usage rights to the project.

## Getting Help

If you need help or have questions:
1. Check the README.md for setup instructions
2. Review existing issues for similar problems
3. Ask questions in GitHub discussions
4. Review the codebase for examples

## Author

Developed by CEO – Chukwuka Emmanuel Ogugua.
