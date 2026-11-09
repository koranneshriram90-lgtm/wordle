# Wordle - 5 Letter Word Game

A free, responsive, pure HTML/CSS/JS Wordle clone that works on desktop and mobile. No build step, no dependencies, no backend — just open `index.html` in any browser.

![Wordle screenshot](https://via.placeholder.com/640x360?text=Wordle+Game) <!-- optional: replace with real screenshot -->

## Features

- **Classic Wordle gameplay**: Guess the 5-letter word in 6 tries (or 4/8 depending on difficulty)
- **Three difficulty modes**:
  - **Easy** — 8 guesses, smaller pool of common words
  - **Medium** — 6 guesses, all valid 5-letter English words
  - **Hard** — 4 guesses, all valid words + hard-mode rules (must reuse revealed letters)
- **Full word list**: 15,921 valid 5-letter English words included (`words.js`)
- **Responsive design**: Optimized for desktop, tablets, and mobile phones
- **On-screen keyboard** + physical keyboard support
- **Statistics**: Games played, win %, current/max streak, guess distribution (saved to `localStorage`)
- **Modals**: How to Play, Statistics, Game Over
- **Zero dependencies**: Pure HTML, CSS, and JavaScript
- **Accessibility**: ARIA labels, keyboard navigation, reduced-motion support

## Getting Started

### Option 1: Open directly
Download or clone the repository and open `index.html` in your browser:

```bash
git clone https://github.com/YOUR_USERNAME/wordlegame.git
cd wordlegame
open index.html  # macOS
# or double-click index.html in your file explorer
```

### Option 2: GitHub Pages
1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` (or `master`) → `/ (root)`
4. Your game will be live at `https://YOUR_USERNAME.github.io/wordlegame/`

### Option 3: Local server (optional)
If you prefer serving over HTTP:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (if you have http-server)
npx http-server

# Then visit http://localhost:8000
```

## Project Structure

```
wordlegame/
├── index.html      # Game HTML structure
├── style.css       # Responsive styling
├── script.js       # Game logic (pure JS)
├── words.js        # 15,921 valid 5-letter English words
├── words5.txt      # Source word list (one word per line)
├── README.md       # This file
└── .gitignore      # Git ignore rules
```

## How to Play

1. Enter any valid 5-letter word using your keyboard or the on-screen keys.
2. Press **Enter** to submit.
3. Tile colors indicate:
   - 🟩 **Green**: Letter is in the word and in the correct spot.
   - 🟨 **Yellow**: Letter is in the word but in the wrong spot.
   - ⬜ **Gray**: Letter is not in the word at all.
4. You have 6 tries (4 on Hard, 8 on Easy) to guess the word.
5. After the game, view your statistics or start a new game.

## Customization

### Change the word list
Edit `words.js` and replace the `WORD_LIST` array with your own words (all must be lowercase, 5 letters, alphabetic).

### Change colors
Edit the CSS variables and tile color classes in `style.css`:
- `.tile.correct` — green (`#6aaa64`)
- `.tile.present` — yellow (`#c9b458`)
- `.tile.absent` — gray (`#787c7e`)

## License

MIT License — feel free to use, modify, and distribute.

## Credits

Inspired by the original Wordle by Josh Wardle and The New York Times.

---

Made with ❤️ using pure HTML, CSS, and JavaScript.
