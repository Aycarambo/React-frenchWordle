import seedrandom from "seedrandom"
import filteredWords from "./cleanWords.json"
import dayjs from "dayjs"

function getWordOfTheDay() {
  const date = dayjs().format("YYYY-MM-DD")
  var myrng = new seedrandom(date)
  const wordOfTheDay = filteredWords[Math.round(myrng() * filteredWords.length)]
  return wordOfTheDay
}

function isValidWord(word) {
  return filteredWords.includes(word)
}
export { getWordOfTheDay, isValidWord }
