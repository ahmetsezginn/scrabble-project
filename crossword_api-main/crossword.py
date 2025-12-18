import random
import json
class Crossword:
    
    def __init__(self, words, grid_width, grid_height):
        self.words = words
        self.words_placed = [] # words are stored in json format
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.grid = []
        self.output_grid = []

    # Create grid
    def create_grid(self):
        self.grid = [['-' for _ in range(self.grid_width)] for _ in range(self.grid_height)]
    
    #random direction
    def random_direction(self):
        
        direction = random.choice(['Vertical', 'Horizontal'])
        return direction
    #check word location
    def check_location(self,word,start_x,start_y,direction,letter_word):# will add more control later abaout word size is greater than grid size
        if direction=='Vertical':
            if start_x<0 or start_y<0 or start_x+len(word)>self.grid_height or start_y==self.grid_width:
                return False
            if start_x>0 and self.grid[start_x-1][start_y]!='-':
                return False
            if start_x+len(word)<self.grid_height and self.grid[start_x+len(word)][start_y]!='-':
                return False
            
            for i in range(len(word)):
                if self.grid[start_x+i][start_y]!='-' and self.grid[start_x+i][start_y]!=letter_word:
                    return False

                if start_y>0 and self.grid[start_x+i][start_y-1]!='-' and self.grid[start_x+i][start_y]!=letter_word:
                    return False
                if start_y+1<self.grid_width and self.grid[start_x+i][start_y+1]!='-' and self.grid[start_x+i][start_y]!=letter_word:
                    return False

        else:

            if start_x<0 or start_y<0 or start_x>self.grid_height or start_y+len(word)+1>self.grid_width:
                return False
            if start_y>0 and self.grid[start_x][start_y-1]!='-':
                return False
            if start_y+len(word)<self.grid_width and self.grid[start_x][start_y+len(word)]!='-': #if word start index and len quels to grid width use -1
                return False
            for i in range(len(word)):
                if self.grid[start_x][start_y+i]!='-' and self.grid[start_x][start_y+i]!=letter_word:
                    
                    return False

                if start_x>0 and self.grid[start_x-1][start_y+i]!='-' and self.grid[start_x][start_y+i]!=letter_word:
                    return False
                if start_x+1<self.grid_height and self.grid[start_x+1][start_y+i]!='-' and self.grid[start_x][start_y+i]!=letter_word:
                    return False

        return True #will edit later
        
    #check if word can be added to grid
    def can_place(self,word,start_x,start_y,direction,letter_word_index,letter_word):
        if direction=='Vertical':
            
            if (self.check_location(word,start_x-letter_word_index,start_y,direction,letter_word))==True:
                return word,start_x-letter_word_index,start_y,direction
            elif (self.check_location(word,start_x,start_y-letter_word_index,'Horizontal',letter_word))==True:
                return word,start_x,start_y-letter_word_index,'Horizontal'
        else:
            
            if (self.check_location(word,start_x,start_y-letter_word_index,direction,letter_word))==True:
                return word,start_x,start_y-letter_word_index,direction
            elif (self.check_location(word,start_x-letter_word_index,start_y,'Vertical',letter_word))==True:
                return word,start_x-letter_word_index,start_y,'Vertical'
        return False
    #add word to grid
    def add_to_grid(self,word,start_x,start_y,direction):
        if direction=='Vertical':
            for i in range(len(word)):
                self.grid[start_x+i][start_y]=word[i]
        else:
            for i in range(len(word)):
                self.grid[start_x][start_y+i]=word[i]
                
        self.words.remove(word)
        data={
            'words':word,
            'start_x':start_x,
            'start_y':start_y,
            'direction':direction
        }
        json_data=json.dumps(data)
        self.words_placed.append(json_data)
    #place firstword to grid in center of grid
    def place_firstword(self):

        word = random.choice(self.words)

        direction = self.random_direction()
        #find start point for first word
        if direction == 'Vertical':
            start_x = random.randint(0, self.grid_height - len(word))
            start_y = random.randint(0, self.grid_width - 1)
        else:
            start_x = random.randint(0, self.grid_height - 1)
            start_y = random.randint(0, self.grid_width - len(word))
        self.add_to_grid(word,start_x,start_y,direction)

    #add second word to grid
    def add_word(self, word):
        
        temp_placed_words=self.words_placed.copy()
        random.shuffle(temp_placed_words)
        direction=self.random_direction()
        letter_word_index=0
        for letter_word in word:
            
            for placed_word in temp_placed_words.copy():

                index_of_letter=0
                for letter_placed_word in json.loads(placed_word)['words']:

                    if letter_word==letter_placed_word:

                        if json.loads(placed_word)['direction']=='Vertical':
                            start_x=json.loads(placed_word)['start_x']+index_of_letter
                            start_y=json.loads(placed_word)['start_y']
                        else:
                            start_x=json.loads(placed_word)['start_x']
                            start_y=json.loads(placed_word)['start_y']+index_of_letter
                        
                        resultof_canplace= self.can_place(word,start_x,start_y,direction,letter_word_index,letter_word)
                        if resultof_canplace!=False:
                            start_x=resultof_canplace[1]
                            start_y=resultof_canplace[2]
                            direction=resultof_canplace[3]
                            return start_x,start_y,direction

                    index_of_letter+=1
            letter_word_index+=1
        return False
    def add_all_words(self):
        random.shuffle(self.words)
        for word in self.words.copy():

            data_word = self.add_word(word)
            if data_word:
                self.add_to_grid(word, data_word[0], data_word[1], data_word[2])
    #use all words in list
    def loop_add_all_words(self):
        count=0
        while len(self.words) > 0 and count < 10:

            self.add_all_words()
            count+=1
    #create output grid
    def create_output_grid(self):
        self.output_grid=self.grid.copy()
    #create puzzle
    def create_puzzle(self):
        self.create_grid()
        self.place_firstword()
        self.loop_add_all_words()
        self.create_output_grid()
        print('Words could not be placed:',self.words)
class BestPuzzle:
    def __init__(self, words, grid_width, grid_height):
        self.words = words
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.best_puzzle = []
        self.best_puzzle_text = ''
    def select_best_puzzle(self):
        count = 0
        while count < 10:
            crossword = Crossword(words=self.words.copy(), grid_width=self.grid_width, grid_height=self.grid_height)
            crossword.create_puzzle()
            if len(crossword.words) == 0:
                self.best_puzzle = crossword.output_grid
                break
            count += 1

        if len(crossword.words) >0:
            self.best_puzzle = crossword.output_grid
            for row in self.best_puzzle:
                self.best_puzzle_text += f"{''.join(row)}\n"
            self.best_puzzle_text += '-'*self.grid_width+'\n'
            for word in crossword.words:
                self.best_puzzle_text += f'{word}'+'-'*(self.grid_width-len(word))+'\n'
        else:
            for row in self.best_puzzle:
                self.best_puzzle_text += f"{''.join(row)}\n"
        return self.best_puzzle_text
if __name__ == "__main__":
    words = ['ahmet', 'umut','selim','mehmet','mervan','govo']
    grid_width = 10
    grid_height = 20
    best_puzzle=BestPuzzle(words=words, grid_width=grid_width, grid_height=grid_height)
    best_puzzle.select_best_puzzle()
    print(best_puzzle.best_puzzle_text)