# WhatsApp Privacy Shield

## Description

WhatsApp Privacy Shield is a browser extension that enhances your privacy when using WhatsApp Web. It obfuscates the last message of each chat in your conversation list, revealing the original text only when you hover over it.

## Features

- 🔒 Obfuscates preview messages in the chat list
- 👀 Reveals messages on hover
- 🧩 Preserves emojis and special characters
- 🔄 Works with dynamic content loading

## Installation

1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the downloaded folder
5. Open WhatsApp Web

## How It Works

The extension uses content scripts to modify the WhatsApp Web interface. It shuffles the characters in preview messages while preserving the first and last characters, making it difficult for others to read your messages at a glance, but allowing you to recognize them.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy

This extension runs entirely in your browser and doesn't collect any data. All message obfuscation happens locally.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/cleitoncsalvagni/whatsapp-privacy-shield/issues) on GitHub.
