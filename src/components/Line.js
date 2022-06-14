import clsx from "clsx"
import { useState, useEffect } from "react"

function Line({ value: guess, maxLength, validate = false, word: answer }) {
  const [validatedGuess, setValidatedGuess] = useState(null)
  let wordTemp = answer
  let isLetterInWord = false
  const [wordStatusArray, setWordStatusArray] = useState([])

  useEffect(() => {
    if (validate) {
      setValidatedGuess(guess)
      //[wrongPos, null, valid, null, ...]
      let tempWordStatusArray = []
      //{c:1, b:0, ...}
      const letterOccurencesInAnswer = {}
      const letterOccurencesInGuess = {}
      guess.split("").forEach((letter) => {
        letterOccurencesInGuess[letter] = letterOccurencesInGuess[letter] + 1 || 1
      })

      //null = not in word
      //valid = letter is at the right position
      //[null, null, valid, null]
      tempWordStatusArray = answer.split("").map((letter, index) => {
        if (letter === guess[index]) {
          //if letter is at right position
          letterOccurencesInGuess[letter] -= 1
          // don't count valid letters occurences in answer
          return "valid"
        }

        letterOccurencesInAnswer[letter] = letterOccurencesInAnswer[letter] + 1 || 1
        return null
      })
      //[wrongPos, null, valid, null]
      tempWordStatusArray = guess.split("").map((letter, index) => {
        if (tempWordStatusArray[index]) {
          return tempWordStatusArray[index]
        }
        if (letterOccurencesInAnswer[letter] > 0) {
          letterOccurencesInAnswer[letter] -= 1
          return "wrongPos"
        }
        return null
      })
      setWordStatusArray(tempWordStatusArray)
    }
    // eslint-disable-next-line
  }, [validate])
  return (
    <div className="line">
      {Array.from(Array(maxLength).keys()).map((index) => {
        if (validatedGuess) {
          const letter = validatedGuess[index]

          isLetterInWord = wordTemp.includes(letter)
          if (isLetterInWord) {
            const regex = new RegExp(`${letter}`, "i")
            wordTemp = wordTemp.replace(regex, "#")

            wordTemp.indexOf(letter)
            isLetterInWord = false
          }
        }

        return (
          <div
            key={index}
            className={clsx("tile", {
              validated: validate,
              "letter-in-wrong-position": validatedGuess && wordStatusArray[index] === "wrongPos",
              "letter-in-correct-position": validatedGuess && wordStatusArray[index] === "valid",
              "letter-not-in-word": validatedGuess && !wordStatusArray[index]
            })}
          >
            {validatedGuess ? validatedGuess[index] : guess[index]}
          </div>
        )
      })}
    </div>
  )
}

export default Line
