import fs from "fs"

fs.readFile(
  "./node_modules/an-array-of-french-words/index.json",
  (error, data) => {
    let words = JSON.parse(data)
    const cleanWords = words
      .map((word) => {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      })
      .filter((word) => !/[^a-z]/gi.test(word))
      .filter((word) => word.length > 4 && word.length < 9)

    fs.writeFileSync("./cleanWords.json", JSON.stringify(cleanWords))
    console.log(cleanWords)
  }
)
console.log("test")
