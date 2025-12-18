# Scrabble Project

A web application that allows users to create and customize crossword puzzles. Users can customize their puzzles, add background images, and save their creations.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ahmetsezginn/scrabble-project.git
    cd scrabble-project
    ```

2. Create and activate Python virtual environment:

    **Windows:**
    ```sh
    python -m venv venv
    venv\Scripts\activate
    ```

    **Linux/Mac:**
    ```sh
    python -m venv venv
    source venv/bin/activate
    ```

3. Install Python dependencies:
    ```sh
    pip install -r crossword_api-main/requirements.txt
    ```

4. Install Node.js dependencies:
    ```sh
    npm install
    ```

### Running the Application

You need to run **two servers** in separate terminals:

**Terminal 1 - Python API Server:**
```sh
# Activate virtual environment first
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

python crossword_api-main/main.py
```

**Terminal 2 - Node.js Web Server:**
```sh
node server.js
```

After both servers are running, open your browser and navigate to `http://localhost:3001`

## 📖 Usage

### Features

- **Crossword Puzzle Editor**: Create and edit crossword puzzles with custom clues and answers
- **Customization Options**: Add background images and adjust puzzle contrast
- **Image Export**: Save your puzzles as images for later use
- **Multiple Letter Styles**: Choose from 5 different letter tile designs

## 📁 Project Structure

```
scrabble-project/
├── controllers/           # Application logic controllers
│   ├── imageController.js
│   ├── puzzleController.js
│   └── puzzleControllerV1_1.js
├── crossword_api-main/    # Python crossword generation API
│   ├── main.py
│   ├── crossword.py
│   └── requirements.txt
├── public/                # Static files
│   ├── css/
│   ├── images/
│   └── js/
├── routers/               # Express route handlers
│   ├── imageRouter.js
│   ├── puzzleRouter.js
│   └── puzzleRouterV1_1.js
├── views/                 # EJS template files
│   ├── index.ejs
│   └── scrableHomeV1_1.ejs
├── server.js              # Main Node.js entry point
├── setup.bat              # Installation script (Windows)
└── setup.sh               # Installation script (Linux/Mac)
```

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js
- Python with FastAPI

**Frontend:**
- EJS (Embedded JavaScript templates)
- Vanilla JavaScript
- CSS

**Dependencies:**
- `canvas` - Canvas API for Node.js
- `ejs` - Server-side HTML templating
- `express` - Web server framework
- `node-fetch` - HTTP requests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

## 📄 License

This project is licensed under the [ISC License](LICENSE).

## 👤 Author

**Ahmet Sezgin**
- GitHub: [@ahmetsezginn](https://github.com/ahmetsezginn)