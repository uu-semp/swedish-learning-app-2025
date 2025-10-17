## Project Overview

This educational game targets two distinct user groups and provides an engaging way to practice Swedish vocabulary recognition. Players listen to audio files and select the matching image from multiple options, reinforcing word-picture associations.

## Architecture

### Display Components

**Root Directory Components**

- **Welcome Page**: Introduction and tutorial for new users
- **Select Page**: Category selection menu for customizing learning sessions

**Options Directory**

- **Options Component**: Consistent UI settings interface across all game pages
- Provides uniform user experience for configuration and preferences

**Game Components**

- **Main Game**: Core gameplay loop handling image selection, guess confirmation, and progress tracking
- **End Screen**: Results analysis with filtering capabilities to review correct/incorrect answers and identify areas needing practice

### Data and Logic Layer

**Store Component**

- API interface for local storage and database operations
- Formats data for easy consumption by other components
- Centralized data management solution

**Selection Component**

- Session management and word randomization
- Controls game progression logic and word selection algorithms
- Extensible design for future complexity enhancements

## Testing

### Running Tests

Current testing is conducted through an HTML test page in the selection component:

- Enable specific test scripts (e.g., `store_tests`, `selection_system_test`)
- Execute unit tests for individual components
- **Future Improvement**: Migrate to JEST framework for enhanced testing capabilities

### Test Coverage

- **Unit Tests**: Individual function testing for store component
- **Integration Tests**: Cross-function testing within store operations
- **System Tests**: Comprehensive testing of selection component functionality
- **Future Needs**: Stress testing and security testing implementation

## Contributing

### Guidelines

1. **Architecture Compliance**: Follow the established project architecture (refer to D3 hand-in for details)
2. **Licensing**: Ensure all images have traceable licensing information
3. **Accessibility**: Maintain keyboard navigation support throughout the application
4. **User Experience**: Prioritize accessible design patterns

### Future Development Opportunities

| Priority | Area                   | Description                                               |
| -------- | ---------------------- | --------------------------------------------------------- |
| Urgent   | Code Modularity        | Refactor JavaScript for better modularity and reusability |
| High     | Testing Enhancement    | Implement comprehensive stress and security testing       |
| High     | Accessibility          | Fix HTML structure for screen reader compatibility        |
| Medium   | Progress Visualization | Display player progress metrics within the game interface |
| Medium   | Design Refinement      | Improve visual consistency across all pages               |
| Medium   | Documentation          | Create detailed documentation for display components      |

---

_This README was written using speech-to-text and then formatted using an LLM_
