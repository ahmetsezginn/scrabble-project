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

2. Run the setup script:

    **Windows:**
    ```sh
    setup.bat
    ```

    **Linux/Mac:**
    ```sh
    chmod +x setup.sh
    ./setup.sh
    ```

    This will:
    - Create a Python virtual environment
    - Install Python dependencies
    - Install Node.js dependencies

### Running the Application

**Windows:**
```sh
python run.py
```
or double-click `run.bat`

This will start both the Python API server and the Node.js web server, and automatically open the application in your browser.

## 📖 Usage

After starting the application, navigate to `http://localhost:3001` in your browser.

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
├── run.py                 # Startup script (Python)
├── run.bat                # Startup script (Windows)
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