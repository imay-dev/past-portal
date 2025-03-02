# Past Portal

**A Beautiful New Tab Experience with Historical Events**

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/igimkgocbagpfablncpchfdlhobcgkge?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/past-portal/igimkgocbagpfablncpchfdlhobcgkge)

Transform your new tab into a time machine! Discover captivating historical events with beautiful visuals every time you open a new tab. Powered by Wikipedia's "On This Day" API.

![Screenshot](images/screenshot.png)

## Features

- 🎯 **Daily Historical Events**: Each new tab reveals a fascinating event from history
- 📚 **My Time Capsule**: Save and manage your favorite historical moments
- 🔄 **Smart Refresh**: Load different events from the same day with a single click
- 💾 **Offline Support**: View cached content even without internet

## Installation

### For Users

1. Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/pastportal/igimkgocbagpfablncpchfdlhobcgkge)
2. Open a new tab to start exploring history!

### For Developers

1. Clone the repository:
   ```bash
   git clone https://github.com/imay-dev/past-portal.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## Usage

- 📖 **Browse History**: Each new tab shows a random historical event from today
- 🔄 **Refresh**: Click the refresh button (bottom-right) for a different event
- 💫 **Bookmark**: Save interesting events using the bookmark button (bottom-left)
- 📚 **View Bookmarks**: Access your saved events from the Time Capsule (top-right)
- 🔍 **Learn More**: Click "Read Full Story" to view the complete Wikipedia article

## Permissions

The extension requires the following permissions:

- **Storage**: For saving bookmarks locally and caching content for offline use
  - Bookmarks are stored in your browser
  - No data is sent to external servers
  - Improves performance and reduces API calls

## Changelog

### Version 2.0.0

- ✨ Added bookmarking system with "My Time Capsule" page
- 🚀 Implemented smart caching for better performance
- 🔄 Added retry mechanism for failed requests

### Version 1.0.0

- 🎉 Initial release
- 📖 Basic historical event display
- 🖼️ Beautiful visual interface
- 🔄 Manual refresh capability

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Historical data provided by [Wikipedia's On This Day API](https://api.wikimedia.org/)
- Icons by [Font Awesome](https://fontawesome.com/)

## Author

**Maysam Serni**

- GitHub: [@imay-dev](https://github.com/imay-dev)

---

If you enjoy Past Portal, please consider [leaving a review](https://chrome.google.com/webstore/detail/pastportal/igimkgocbagpfablncpchfdlhobcgkge) on the Chrome Web Store! 🌟
