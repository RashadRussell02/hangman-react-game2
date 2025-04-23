// Rashad Russell: This file runs the main hangman game logic

import React, { useState, useEffect } from 'react';
import { recordGameResult, getWinPercentage } from './mongoClient';

const HangmanGame = () => {
  // Rashad Russell: Word the player is trying to guess (can be randomized later)
  const word = "react";

  // Rashad Russell: State hooks to track gameplay
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [inputLetter, setInputLetter] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [wins, setWins] = useState(0);     // Rashad Russell: Count player wins
  const [losses, setLosses] = useState(0); // Rashad Russell: Count player losses

  // Rashad Russell: Player ID (can be dynamic later)
  const username = "player1";

  // Rashad Russell: Max number of wrong guesses before losing
  const maxWrong = 6;

  // Rashad Russell: Hangman images ordered by how many wrong guesses have happened
  const hangmanImages = [
    "noose.png",
    "upperbody.png",
    "upperandlowerbody.png",
    "1arm.png",
    "botharms.png",
    "1leg.png",
    "dead.png"
  ];

  // Rashad Russell: Handle user letter submission
  const handleGuess = () => {
    if (!inputLetter || gameOver) return;

    const letter = inputLetter.toLowerCase();

    // Rashad Russell: Ignore duplicate guesses
    if (guessedLetters.includes(letter)) {
      setInputLetter("");
      return;
    }

    // Rashad Russell: Add new guessed letter to state
    setGuessedLetters([...guessedLetters, letter]);

    // Rashad Russell: Update wrong guess count if letter not in word
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }

    // Rashad Russell: Clear input after guess
    setInputLetter("");
  };

  // Rashad Russell: Check for win/loss and handle end-of-game logic
  useEffect(() => {
    const isWinner = word.split('').every(letter => guessedLetters.includes(letter));
    const isLoser = wrongGuesses >= maxWrong;

    // Rashad Russell: Stop game if player has won or lost
    if (isWinner || isLoser) {
      setGameOver(true);
      const didWin = isWinner;

      // Rashad Russell: Show end-of-game message
      setMessage(didWin ? "🎉 You won!" : "💀 You lost");

      // Rashad Russell: Update in-game scoreboard
      if (didWin) {
        setWins(prev => prev + 1);
      } else {
        setLosses(prev => prev + 1);
      }

      // Rashad Russell: Save game result to MongoDB and show win %
      const handleGameEnd = async () => {
        try {
          await recordGameResult(username, didWin);
          const winPercent = await getWinPercentage(username);
          alert(`Your win percentage: ${winPercent}%`);
        } catch (err) {
          console.error("Rashad Russell: Error saving game result", err);
        }
      };

      handleGameEnd();
    }
  }, [guessedLetters, wrongGuesses]);

  return (
    <div>
      <h1>Hangman Game</h1>
      <p>Guess the word one letter at a time!</p>

      {/* Rashad Russell: Scoreboard display */}
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Wins: {wins} | Losses: {losses}
      </div>

      {/* Rashad Russell: Show current hangman image based on incorrect guesses */}
      <img
        src={`/${hangmanImages[Math.min(wrongGuesses, maxWrong)]}`}
        alt={`Hangman stage ${wrongGuesses}`}
        style={{ width: "200px", margin: "20px 0" }}
      />

      {/* Rashad Russell: Show current progress of guessed word */}
      <p>
        Word: {
          word.split('').map(letter =>
            guessedLetters.includes(letter) ? letter : "_"
          ).join(" ")
        }
      </p>

      {/* Rashad Russell: Show guessed letters and number of wrong guesses */}
      <p>Guessed Letters: {guessedLetters.join(", ")}</p>
      <p>Wrong Guesses: {wrongGuesses} / {maxWrong}</p>

      {/* Rashad Russell: Only allow input if game is still ongoing */}
      {!gameOver && (
        <>
          <input
            type="text"
            placeholder="Enter a letter"
            value={inputLetter}
            onChange={(e) => setInputLetter(e.target.value)}
            maxLength={1}
          />
          <button onClick={handleGuess}>Submit</button>
        </>
      )}

      {/* Rashad Russell: End-of-game message */}
      {gameOver && <h2>{message}</h2>}
    </div>
  );
};

export default HangmanGame;
