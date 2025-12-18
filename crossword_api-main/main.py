import flask
from flask import request, Response,jsonify
from crossword import BestPuzzle
import os
def simplify(text):
    text_array=[]
    new_text = ''
    for line in text.split('\n'):
        text_array.append(list(line))
    # Remove leading rows of dashes
    while text_array and all(char == '-' for char in text_array[0]):
        text_array.pop(0)

    # Remove trailing rows of dashes
    while text_array and all(char == '-' for char in text_array[-1]):
        text_array.pop()
    # Remove leading dashes
    while True:
        count = 0
        for i in text_array:
            if i[0] == '-':
                count += 1
        if count == len(text_array):
            for i in range(len(text_array)):
                text_array[i].pop(0)
        else:
            break

    # Remove trailing dashes
    while True:
        count = 0
        for i in text_array:
            if i[-1] == '-':
                count += 1
        if count == len(text_array):
            for i in range(len(text_array)):
                text_array[i].pop()
        else:
            break
    for i in text_array:
        new_text += ''.join(i)+'\n'
    return new_text
app = flask.Flask(__name__) 
@app.route('/generate-puzzle')
def hello():
    return "Hello World!"
@app.route('/generate-puzzle', methods=['POST'])
def generate_puzzle():
    data = request.json
    words = data.get('names', [])
    grid_width = data.get('width', 11)
    grid_height = data.get('height', 14)
    
    best_puzzle = BestPuzzle(words=words, grid_width=grid_width, grid_height=grid_height)
    best_puzzle.select_best_puzzle()
    new_text = simplify(best_puzzle.best_puzzle_text)
    return jsonify({"puzzle": new_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))