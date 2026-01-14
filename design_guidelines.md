# QR Code Generator Design Guidelines

## Design Approach
**Hybrid System-Based with Modern Flair**: Drawing from Material Design's component structure and Fluent Design's depth system, enhanced with glassmorphism for visual impact. This utility-focused app prioritizes efficient workflows while maintaining modern aesthetics.

## Layout System

**Two-Column Dashboard Layout**
- Left Panel (40% width): All input controls and customization options organized in expandable sections
- Right Panel (60% width): Large, centered QR code preview with download controls
- Responsive: Stack vertically on mobile (controls first, then preview)
- Container: max-w-7xl with px-6 py-8

**Spacing System**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component gaps: gap-6
- Section padding: p-6 to p-8
- Tight spacing for related controls: gap-2
- Card spacing: space-y-6

## Typography

**Font Family**: 'Inter' from Google Fonts (modern, clean, excellent for UI)
- Primary UI: font-medium
- Labels: text-sm font-semibold uppercase tracking-wide
- Headings: text-2xl font-bold
- Body: text-base

## Component Library

### Input Controls Panel
**Organized into collapsible sections:**
1. **Input Type Selector**: Prominent tab-style buttons (URL, Text, Email, Phone, Bitcoin, File Upload)
2. **QR Code Settings**: Size slider, error correction radio buttons
3. **Customization**: Color pickers (foreground/background), corner style toggle, opacity sliders
4. **Logo Upload**: Drag-and-drop zone with image preview thumbnail
5. **Frame Options**: Template cards with visual previews, custom text input
6. **Advanced**: Scan tracking toggle, quality selector

**Control Components:**
- Text inputs: Rounded corners (rounded-lg), focus states with ring effects
- Sliders: Custom styled with visible track and thumb
- Color pickers: Click-to-reveal popup with hex input
- File upload: Dashed border drop zone with upload icon
- Toggles: Switch-style (not checkboxes) for binary options

### Preview Panel
- **QR Code Display**: Centered, large preview with real-time updates
- **Download Section**: Row of format buttons (PNG, JPG, SVG, EPS) below preview
- **Stats Display**: Small badge showing "Scan Tracking: Enabled" when active

### Glassmorphism Implementation
Apply to main panel containers:
- backdrop-blur-lg with semi-transparent background
- Subtle border with border-white/20
- Shadow: shadow-2xl for depth
- Background gradients for visual interest

### Navigation Header
- App logo/title on left
- Light/dark mode toggle on right
- Minimal height (h-16) with subtle bottom border

## Component Details

**Buttons:**
- Primary (Download): Solid with rounded-lg, font-semibold, px-6 py-3
- Secondary (Reset): Outlined style
- Input type tabs: Pill-shaped with active state emphasis
- All buttons: Smooth hover transitions

**Cards:**
- Frame template cards: Aspect ratio 1:1, border on hover, cursor-pointer
- Settings cards: Rounded-xl with subtle shadow

**Form Elements:**
- Labels: Always above inputs, font-semibold text-sm
- Input fields: Rounded-lg, px-4 py-2.5, border with focus ring
- Helper text: text-xs text-gray-500 below inputs

## Interactions

**Real-time Preview:**
- Debounced updates (300ms) as user types or adjusts controls
- Smooth fade transition when QR code regenerates
- Loading spinner overlay during generation

**Animations:**
- Collapsible sections: Smooth height transitions
- Logo upload: Scale-up on successful upload
- Download buttons: Subtle scale on hover
- NO distracting scroll or parallax effects

## Responsive Behavior

**Desktop (lg+):** Two-column side-by-side layout
**Tablet (md):** Two-column with narrower left panel
**Mobile:** Single column stack, sticky preview at bottom with fixed download bar

## Quality Standards

- All controls must have clear, descriptive labels
- Maintain consistent 6-unit vertical rhythm between sections
- Use proper ARIA labels for accessibility
- Ensure color pickers work with keyboard navigation
- Preview updates should never feel laggy

**No Hero Section**: This is a utility app - users land directly on the functional interface.