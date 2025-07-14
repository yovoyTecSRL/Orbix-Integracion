# ORBIX UI Controls

## Overview
This document provides comprehensive documentation for ORBIX UI control components, including usage examples, properties, and best practices.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Available Controls](#available-controls)
- [Common Properties](#common-properties)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Installation

```bash
npm install @orbix/ui-controls
```

## Getting Started

```javascript
import { OrbixButton, OrbixInput, OrbixModal } from '@orbix/ui-controls';
```

## Available Controls

### Buttons
- Primary Button
- Secondary Button
- Icon Button
- Toggle Button

### Input Controls
- Text Input
- Number Input
- Password Input
- Search Input
- Textarea

### Layout Controls
- Grid
- Container
- Sidebar
- Header/Footer

### Navigation
- Menu
- Breadcrumbs
- Tabs
- Pagination

### Data Display
- Table
- List
- Cards
- Charts

### Feedback
- Modal
- Toast
- Alert
- Progress Bar

## Common Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `className` | string | '' | Additional CSS classes |
| `disabled` | boolean | false | Disable the control |
| `variant` | string | 'default' | Visual variant |
| `size` | string | 'medium' | Control size |

## Examples

### Basic Button
```jsx
<OrbixButton variant="primary" size="large">
    Click Me
</OrbixButton>
```

### Form Input
```jsx
<OrbixInput
    type="text"
    placeholder="Enter text"
    onChange={handleChange}
/>
```

## Best Practices

1. **Consistency**: Use the same control variants throughout your application
2. **Accessibility**: Ensure all controls are keyboard navigable
3. **Performance**: Import only the controls you need
4. **Theming**: Use the provided theme system for customization

## API Reference

Detailed API documentation for each control can be found in the individual component files.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details.