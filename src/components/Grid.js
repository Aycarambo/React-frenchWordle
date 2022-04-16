import Line from "./Line"

function Grid({ lines, lineToValidate, value, maxLength, word }) {
  console.log(lineToValidate)
  return (
    <div>
      {Array.from(Array(lines).keys()).map((index) => (
        <Line
          key={index}
          value={index <= lineToValidate ? value : ""}
          maxLength={maxLength}
          validate={index < lineToValidate}
          word={word}
        />
      ))}
    </div>
  )
}

export default Grid
