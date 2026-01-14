# QR Code Generator

A feature-rich, interactive QR code generator web application built with pure HTML, Tailwind CSS, and vanilla JavaScript.

![QR Code Generator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Multiple Input Types**: Generate QR codes for URLs, Text, Email, Phone, Bitcoin, WiFi, SMS, and vCard
- **Real-time Preview**: QR codes update automatically as you type (300ms debounce)
- **Extensive Customization**:
  - Adjustable size (128px - 512px)
  - 4 error correction levels (L, M, Q, H)
  - Custom foreground and background colors
  - Square or rounded corner styles
  - Logo overlay with opacity control
  - 6 frame templates with custom text
- **Multiple Download Formats**: PNG, JPG, SVG
- **Dark/Light Mode**: Theme toggle with system preference detection and localStorage persistence
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Dependencies**: Pure HTML, CSS, and JavaScript (only uses Tailwind CSS CDN and QRCode.js library)

## Project Structure

```
public/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── app.js          # JavaScript application logic
└── favicon.svg         # SVG favicon
```

## Quick Start

1. Clone or download this repository
2. Open `public/index.html` in your browser
3. Start generating QR codes!

No build process or server required - it's a fully static website.

## Usage

### Input Types

| Type | Description | Example |
|------|-------------|---------|
| URL | Website links | `https://example.com` |
| Text | Plain text content | `Hello World` |
| Email | Email addresses | `name@example.com` |
| Phone | Phone numbers | `+1234567890` |
| Bitcoin | Wallet addresses | `1A1zP1eP5Q...` |
| WiFi | Network SSID | `MyNetwork` |
| SMS | Phone for SMS | `+1234567890` |
| vCard | Contact info | `Name;Phone;Email` |

### Customization Options

- **Size**: Drag the slider to adjust QR code size from 128px to 512px
- **Error Correction**: Choose recovery level (L=7%, M=15%, Q=25%, H=30%)
- **Colors**: Pick custom foreground and background colors
- **Corner Style**: Toggle between square and rounded corners
- **Logo**: Upload an image to overlay on the QR code with adjustable opacity
- **Frames**: Select from 6 frame templates and add custom text

### Download

Click PNG, JPG, or SVG button to download your QR code in the desired format.

## Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: No framework dependencies
- **QRCode.js**: QR code generation library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Author

Built with care for the developer community.
