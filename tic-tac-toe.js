/* 
    npm i prompt chalk 
    node tttGame.js

    Defenitions
    userPlayer - User's team, selected by the User. Possible values are "X" or "Y". 
    roboPlayer - Robot's team, assigned after the User chooses their team. 
    board - 3x3 Grid tracking the status of User and Robot placements.
    winningCombos - An array of sub arrays of winning board combinations. 
    print() - method to print the board.
    init() - Prompts the User to select a team "X" or "Y" and callls userTurn()
    userTurn() - method called to prompt the User to make a placement on the board; subsequently checks for a User win, otherwise calls roboTurn()
    checkForWin() - method called after each time the User makes a placement to check for a win or tie.
    robotTurn() - method called by userTurn() to allow the Robot to make a placement. Will check if a winning move is available
    and makes it; otherwise makes a defensive move preventing the User from winning, otherwise makes a random move. 

*/
const prompt = require('prompt');
const chalk = require('chalk');

// Constructor 
function TicTacToe() {
    this.roboPlayer = ""
    this.userPlayer = ""
    this.possibleMoves = new Set(['tl', 'tm', 'tr', 'ml', 'mm', 'mr', 'bl', 'bm', 'br'])
    this.board = {}
   
    // Stores a collection of arrays which contain winning combinations
    this.winningCombos = [
        ["tl", "tm", "tr"],
        ["tl", "mm", "br"],
        ["tl", "ml", "bl"],
        ["tm", "mm", "bm"],
        ["tr", "mm", "bl"],
        ["tr", "mr", "br"],
        ["mr", "mm", "ml"],
        ["bl", "bm", "br"]
    ]

    // Prints the status of the grid 
    this.print = () => {
        console.log(chalk.blue.bold.bgWhiteBright(
            `${this.board.tl} | ${this.board.tm} | ${this.board.tr} \n${this.board.ml} | ${this.board.mm} | ${this.board.mr} \n${this.board.bl} | ${this.board.bm} | ${this.board.br} `
        ))
    }

    // Ran after the User's placement; checks if it has caused a win or tie; returns "X" or "Y" if there's a winner, "Tie" if there's a tie, or "No winner" otherwise 
    this.checkForWin = () => {
        // Check for winner and return "X" or "Y" if there is one. 
        for (let i = 0; i < this.winningCombos.length; i++) {
            let winningKeys = this.winningCombos[i];
            let key1 = winningKeys[0]
            let key2 = winningKeys[1]
            let key3 = winningKeys[2]
            if ((this.board[key1] === this.board[key2]) && (this.board[key1] === this.board[key3]) &&(this.board[key1] !== "-")) {
                return this.board[key1]
            }
        }

        // Check for a tie and return "Tie" if there is one, otherwise return "No Winner" 
        return this.possibleMoves.size ? "No winner" : "Tie"
    }

    // Robot makes a placement; userTurn() is called if theres no win
    this.roboTurn = () => {   
        // Check for a location to allow the Robot to win or for a defensive move preventing the User from winning
        let optimalMove;
        let defenseMove; 

        this.winningCombos.find((winSet) => {
            let first = winSet[0]
            let second = winSet[1]
            let third = winSet[2]
            if (this.board[first] === this.board[second] && (this.board[third] === "-")) {
                if(this.board[first] === this.roboPlayer){
                    optimalMove = third
                    return true;
                }else if(this.board[first] === this.userPlayer){
                    defenseMove = third
                }
            } else if (this.board[first] === this.board[third] && (this.board[second] === "-")) {
                if(this.board[first] === this.roboPlayer){
                    optimalMove = second
                    return true;
                }else if(this.board[first] === this.userPlayer){
                    defenseMove = second
                }
            } else if(this.board[second] === this.board[third] && (this.board[first] === "-")) {
                if(this.board[second] === this.roboPlayer){
                    optimalMove = first
                    return true;
                }else if(this.board[second] === this.userPlayer){
                    defenseMove = first
                }
            }
        });

        // Makes a winning placement if available, otherwise a defensive move, otherwise a random move
        if (optimalMove) {
            this.board[optimalMove] = this.roboPlayer
            console.log(
                `Robo player ${this.roboPlayer} has won this round!`
            )
            this.print()
        } else if(defenseMove){
            this.board[defenseMove] = this.roboPlayer
            this.possibleMoves.delete(defenseMove)
            console.log(
                `Robo player ${this.roboPlayer} made a defense move at ${defenseMove} `
            )
            this.print()
            this.userTurn()
        } else {
            let max = this.possibleMoves.size - 1
            let randomIndex = getRandomIntInclusive(0, max);
            let options = []
            this.possibleMoves.forEach(i => options.push(i))
            let randomMove = options[randomIndex]
            this.possibleMoves.delete(randomMove)
            this.board[randomMove] = this.roboPlayer;
            console.log(
                `Robo player ${this.roboPlayer} made a move at ${randomMove} `
            )
            this.print()
            this.userTurn()
        }
    }

    // Allow the User to select X or Y as their team and then call userTurn()
    this.init = () => {
        this.possibleMoves.forEach(item=> this.board[item]= "-") 
        let [userPlayer, roboPlayer, init, print, userTurn] = [this.userPlayer, this.roboPlayer, this.init, this.print, this.userTurn]

        const getUserPlayer = () => this.userPlayer
        const setPlayers = (userSelection) => {
            userSelection = userSelection.toLowerCase()
            if (userSelection === "x") {
                [this.userPlayer, this.roboPlayer] = ["X","Y"]
            } else if (userSelection === "y") {
                [this.userPlayer, this.roboPlayer] = ["Y","X"]
            } else {
                console.log("Please input only X or Y")
                this.init()
            }
        }

        prompt.start();
        prompt.get(["Would you like to be player X or Y? Enter 'X' or 'Y'"], function (err, result) {
            // Ask the player to select X or Y as their mark 
            let userSelection = result["Would you like to be player X or Y? Enter 'X' or 'Y'"]
            let regex = /^(y|Y|x|X)$/
            if (!regex.test(userSelection)) {
                console.log("Please enter only X or Y")
                init()
            } else {
                setPlayers(userSelection)
                console.log(chalk.magenta(
                    `Reference: Welcome to TicTacToe! You are player ${getUserPlayer()}. When prompted, state where to make your mark. See reference below: \n 'tl' for top left \n 'tm' for top middle \n 'tr' for top right \n 'ml' for middle left \n 'mm' for middle middle \n 'mr' for middle right \n 'bl' for bottom left \n 'bm' for bottom middle \n 'br' for bottom right`
                ));
                print()
                userTurn()
            }
        })
    }

    // User selects a location, board is checked for a winner or tie; if there is no winner or tie, roboTurn() is called 
    this.userTurn = () => {
        let [roboTurn, userTurn, userPlayer, checkWin, board, print, possibleMoves] = [this.roboTurn, this.userTurn, this.userPlayer, this.checkForWin, this.board, this.print, this.possibleMoves]

        prompt.get([`Player ${userPlayer}, Where would you like to place your mark?`], function (err, result) {
            let playerSelection = result[`Player ${userPlayer}, Where would you like to place your mark?`]
            // Log warning if the User enters a nonexistant location 
            if (!board[playerSelection]) {
                console.log("Please enter a valid location")
                userTurn()
            // Log warning if User inputs a location that has already been selected
            } else if (board[playerSelection] !=="-") {
                console.log("That spot is already taken.")
                userTurn()
            // Mark the location with the User's team, check for a win or tie; if neither exist allow the Robot to make a move 
            } else {
                board[playerSelection] = userPlayer;
                possibleMoves.delete(playerSelection)
                print()

                let winCheck = checkWin()
                if (winCheck === "No winner") {
                    roboTurn()
                } else if (winCheck === "Tie") {
                    console.log("It's a tie!");
                    return
                } else {
                    console.log(`You win, Player ${userPlayer}!`)
                }
            }
        })
    }
}

// Helper functions 
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (
        max - min + 1)) + min;
}

// Initialize the game 
const game = new TicTacToe()
game.init()