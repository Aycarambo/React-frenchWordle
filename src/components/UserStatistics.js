import React, { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import avg from "../utils/avg"
import intToTime from "../utils/formatTime"

function UserStatistics() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    const getStats = async () => {
      let { data /*, error, status */ } = await supabase
        .from("statistics")
        .select(`*`)
        .order("try_count", { ascending: true })
      setStats(data)
    }
    getStats()
  }, [])

  return (
    <div className="modal">
      <p>Nombre moyen d'essais : {avg(stats, "try_count")}</p>
      <p>Temps moyen : {intToTime(avg(stats, "time"))}</p>
    </div>
  )
}

export default UserStatistics
