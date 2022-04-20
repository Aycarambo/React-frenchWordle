import fs from "fs"

fs.readFile("./src/utils/francais-37624.txt", "latin1", (error, data) => {
  let words = data.split("\n")
  const cleanWords = words
    .map((word) => {
      return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    })
    .filter((word) => !/[^a-z]/g.test(word))
    .filter((word) => word.length > 4 && word.length < 9)
  console.log(words.length)
  console.log(cleanWords.length)

  fs.writeFileSync("./cleanWords.json", JSON.stringify(cleanWords))
})
console.log("test")
