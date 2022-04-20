import clsx from "clsx"
import React, { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import avg from "../utils/avg"
import intToTime from "../utils/formatTime"
import SendStats from "./SendStats"
import useLocalStorage from "../hooks/localStorage"

function UserStatistics({ isGameEnded, onClose, word, time, tryCount }) {
  const [stats, setStats] = useState([])
  const [endGameStats, setEndGameStats] = useState([])
  const [userName, setUserName] = useLocalStorage("user_name", "")
  const [hasUserPlayed] = useState(!isGameEnded)
  const [isScoreBoardShown, setIsScoreBoardShown] = useState(!!userName)

  /*
  const [playerIndex, setPlayerIndex] = useState(0)
  const [player, setPlayer] = useState({})
  const [playerScore, setPlayerScore] = useState(<></>)
  */

  useEffect(() => {
    const getStats = async () => {
      let { data } = await supabase
        .from("statistics")
        .select(`*`)
        .eq("word", word)
        .order("try_count", { ascending: true })
        .order("time", { ascending: true })

      setStats(data)
    }
    getStats()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    var playerIndex = stats.findIndex((row) => {
      return row.try_count > tryCount || (row.try_count === tryCount && row.time >= time)
    })
    if (playerIndex === -1) {
      playerIndex = stats.length
    }
    const endGameStats = [...stats]
    if (hasUserPlayed && isGameEnded) {
      endGameStats.splice(playerIndex, 0, {
        id: "USER",
        user_name: userName || "YOU",
        try_count: tryCount,
        time,
        word,
        created_at: new Date()
      })
    }
    setEndGameStats(endGameStats)
    // eslint-disable-next-line
  }, [JSON.stringify(stats), isGameEnded, tryCount])

  /*
  useEffect(() => {
    if (!!endGameStats) {
      setPlayerIndex(endGameStats.findIndex((row) => row.id === "USER"))
      console.log(playerIndex)
      setPlayer(endGameStats[playerIndex])
      setPlayerScore(
        <li value={playerIndex} key={player.id} className="USER">
          {player.user_name} : {player.try_count} essais [{intToTime(player.time)}]
        </li>
      )
    }
  }, [endGameStats])
  */

  const bestTenPlayers = (
    <ol className="score-board">
      <p className="score-board-title">Meilleurs joueurs aujourd'hui</p>
      {endGameStats.slice(0, 10).map((player) => {
        return (
          <li
            key={player.id}
            className={clsx({
              "player-row":
                player.id === "USER" ||
                (player.user_name === userName && player.time === time && player.try_count === tryCount)
            })}
          >
            {player.user_name} : {player.try_count} essais [{intToTime(player.time)}]
          </li>
        )
      })}
      {/*playerIndex > 10 ? playerScore : <></>*/}
    </ol>
  )

  function handleNameSubmitted(name) {
    setIsScoreBoardShown(true)
    setUserName(name)
    setEndGameStats([
      ...endGameStats.map((player) => {
        return player.id === "USER" ? { ...player, user_name: name } : player
      })
    ])
  }

  console.log(stats)
  console.log(avg(stats, "try_count").toFixed(1))

  const avgTryCount = avg(endGameStats, "try_count").toFixed(1)
  const avgTime = intToTime(avg(endGameStats, "time"))

  return (
    <div className="modal">
      <div className="btn-close">
        <img src="/close-icon.png" alt="Fermer" onClick={onClose} />
      </div>
      <p>Nombre d'essais moyen : {avgTryCount}</p>
      <p>Temps moyen : {avgTime}</p>
      {isGameEnded && (
        <SendStats
          onNameSubmitted={handleNameSubmitted}
          word={word}
          time={time}
          tryCount={tryCount}
          userName={userName}
        />
      )}
      {isScoreBoardShown ? (
        bestTenPlayers
      ) : isGameEnded ? (
        <p className="helper-username">Entrez votre nom pour voir votre classement.</p>
      ) : (
        <></>
      )}
    </div>
  )
}

export default UserStatistics
