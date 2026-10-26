# Contributing to Tic-Tac-Toe Arena

Thanks for helping improve Tic-Tac-Toe Arena! This guide explains how to run the project and submit changes.

## Running the Project

### Static version (no install needed)

The core game lives in `index.html`, `style.css`, and `script.js`.

```bash
# macOS
open index.html

# or serve it locally
npx serve .
```

You can also use the VS Code **Live Server** extension.

### Next.js version

The `app/` folder contains a Next.js version of the game. It requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Project Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Entry page for the static game |
| `style.css` | Styles for the static game |
| `script.js` | Game logic: board state, turns, win/draw detection, scores |
| `app/` | Next.js pages and global styles |
| `components/ui/` | Reusable UI components |
| `lib/` | Shared utilities |
| `public/` | Icons and images |

## How to Contribute

1. Fork or clone the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/short-description
   ```
3. Make small, focused changes.
4. Test the game in a browser: check moves, wins, draws, restart, and scores.
5. Commit with a clear message:
   ```bash
   git commit -m "Add keyboard navigation for board cells"
   ```
6. Push your branch:
   ```bash
   git push origin feature/short-description
   ```
7. Open a pull request against `main` and describe what you changed and why.

## Guidelines

- Keep the static game framework-free (plain HTML, CSS, and JavaScript).
- Match the existing code style and naming.
- Keep one feature or fix per pull request.
- Update `README.md` if your change affects how the game is played or set up.

## Reporting Issues

Open a GitHub issue that includes:

- What you expected to happen
- What actually happened
- Steps to reproduce it
- Your browser and operating system

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see `LICENSE`).
