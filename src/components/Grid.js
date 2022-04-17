import Line from "./Line"

function Grid({ state, lineCount, lineToValidate, value, maxLength, word }) {
  return (
    <div className="grid">
      {Array.from(Array(lineCount).keys()).map((index) => (
        <Line
          key={index}
          value={state[index] ? state[index] : index <= lineToValidate ? value : ""}
          maxLength={maxLength}
          validate={state[index] ? true : index < lineToValidate}
          word={word}
        />
      ))}
    </div>
  )
}

export default Grid
