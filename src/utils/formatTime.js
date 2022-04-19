function intToTime(number) {
  const seconds = (number % 60).toLocaleString("fr-FR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
    maximumFractionDigits: 0
  })
  number = Math.floor(number / 60)

  const minutes = (number % 60).toLocaleString("fr-FR", {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  number = Math.floor(number / 60)

  const hours = (number % 60).toLocaleString("fr-FR", {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
  number = Math.floor(number / 60)
  if (hours !== "00") {
    return hours + ":" + minutes + ":" + seconds
  }
  return minutes + ":" + seconds
}

export default intToTime
