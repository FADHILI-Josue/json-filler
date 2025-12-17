# Contributing to Json Filler

First off, thanks for taking the time to contribute! 🎉

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/FADHILI-Josue/json-filler.git
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```
   
4. **Load into Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this project folder.

## How to Submit Changes

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-new-feature`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add some feature'`.
5. Push to the branch: `git push origin feature/my-new-feature`.
6. Submit a Pull Request.

## Coding Standards

- Please ensure your code passes the build process.
- Use the existing folder structure (`src/utils/generator/`).
- If you add new logic for generating data, please add relevant tests or ensure it covers edge cases.
