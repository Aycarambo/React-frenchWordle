import clsx from "clsx"
import { useState, useEffect } from "react"

function Line({ value, maxLength, validate = false, word }) {
  const [validatedValue, setValidatedValue] = useState(null)

  useEffect(() => {
    if (validate) {
      setValidatedValue(value)
    }
  }, [validate, value])
  return (
    <div className="tile-container">
      {Array.from(Array(maxLength).keys()).map((index) => (
        <div
          className={clsx("tile", {
            validated: validate,
            "letter-in-wrong-position":
              validatedValue && word.includes(validatedValue[index]),
            "letter-in-correct-position":
              validatedValue && word[index] === validatedValue[index],
            "letter-not-in-word":
              validatedValue && !word.includes(validatedValue[index])
          })}
        >
          {validatedValue ? validatedValue[index] : value[index]}
        </div>
      ))}
    </div>
  )
}

export default Line
