import clsx from "clsx"
import React, { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import avg from "../utils/avg"
import intToTime from "../utils/formatTime"
import SendStats from "./SendStats"
import useLocalStorage from "../hooks/localStorage"
import { TODAY } from "../utils/today"

function UserStatistics({ isGameEnded, onClose, word, time, tryCount, initialState, setInitialState, hasUserWon }) {
  const [stats, setStats] = useState([])
  const [endGameStats, setEndGameStats] = useState([])
  const [userName, setUserName] = useLocalStorage("user_name", "")
  const [hasUserPlayed] = useState(!isGameEnded)
  const [isScoreBoardShown, setIsScoreBoardShown] = useState(!!initialState[TODAY]?.data_sent)

  const [playerIndex, setPlayerIndex] = useState(0)

  useEffect(() => {
    const getStats = async () => {
      let { data } = await supabase
        .from("statistics")
        .select(`*`)
        .eq("word", word)
        .order("has_won", { ascending: false })
        .order("try_count", { ascending: true })
        .order("time", { ascending: true })

      setStats(data)
    }
    getStats()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    var playerIndex = stats.findIndex((row) => {
      if (!hasUserWon) {
        //if user has lost, he should be last in the scoreboard
        return false
      }
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
        created_at: new Date(),
        position: playerIndex,
        has_won: hasUserWon
      })
    }
    setPlayerIndex(playerIndex)
    setEndGameStats(endGameStats)
    // eslint-disable-next-line
  }, [JSON.stringify(stats), isGameEnded, tryCount])

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
            {`${player.user_name} : `}
            {player.has_won ? `${player.try_count} essais [${intToTime(player.time)}]` : `n'a pas trouvé`}
          </li>
        )
      })}
      {playerIndex >= 10 && (
        <>
          {playerIndex > 10 && <li className="li-no-index">...</li>}
          <li
            value={playerIndex + 1}
            key={endGameStats[playerIndex - 1]?.id}
            className={clsx({
              "player-row":
                endGameStats[playerIndex - 1]?.id === "USER" ||
                (endGameStats[playerIndex - 1]?.user_name === userName &&
                  endGameStats[playerIndex - 1]?.time === time &&
                  endGameStats[playerIndex - 1]?.try_count === tryCount)
            })}
          >
            {`${endGameStats[playerIndex - 1]?.user_name} : `}
            {endGameStats[playerIndex - 1]?.has_won
              ? `${endGameStats[playerIndex - 1]?.try_count} essais [${intToTime(endGameStats[playerIndex - 1]?.time)}]`
              : `n'a pas trouvé`}
          </li>
        </>
      )}
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
          initialState={initialState}
          setInitialState={setInitialState}
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
