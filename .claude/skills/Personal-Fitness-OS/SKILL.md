```markdown
# Personal-Fitness-OS Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the Personal-Fitness-OS TypeScript codebase. You'll learn how to structure files, write imports and exports, follow commit message standards, and organize and run tests. This guide ensures consistency and clarity when contributing to or maintaining the project.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.ts`, `workoutPlan.ts`

### Imports
- Use **alias imports** to reference modules.
  - Example:
    ```typescript
    import { getUserData } from 'services/userService';
    ```

### Exports
- Always use **named exports** (not default).
  - Example:
    ```typescript
    // In workoutPlan.ts
    export function createWorkoutPlan() { ... }
    ```

### Commit Messages
- Follow **conventional commit** style.
- Use the `fix` prefix for bug fixes.
- Keep commit messages concise (average ~57 characters).
  - Example:
    ```
    fix: correct calculation of calories burned in summary
    ```

## Workflows

### Code Contribution
**Trigger:** When adding or updating features or fixing bugs  
**Command:** `/contribute`

1. Create or update files using camelCase naming.
2. Use alias imports and named exports.
3. Write clear, conventional commit messages (e.g., `fix: ...`).
4. Add or update relevant tests in `*.test.*` files.
5. Submit your changes for review.

### Testing
**Trigger:** When verifying code correctness  
**Command:** `/test`

1. Locate or create test files matching `*.test.*`.
2. Write tests using the project's preferred (unspecified) framework.
3. Run the tests using the project's test runner (framework unknown).
4. Ensure all tests pass before merging changes.

## Testing Patterns

- Test files follow the pattern: `*.test.*` (e.g., `userProfile.test.ts`).
- The testing framework is unspecified; check project documentation or existing test files for guidance.
- Place test files alongside the modules they test or in a dedicated test directory.

  Example test file:
  ```typescript
  // userProfile.test.ts
  import { getUserProfile } from 'services/userService';

  describe('getUserProfile', () => {
    it('returns user data for valid ID', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /contribute  | Start the code contribution workflow    |
| /test        | Run or add tests to verify functionality|
```
