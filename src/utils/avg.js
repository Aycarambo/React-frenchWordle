function avg(data, field) {
  return (
    data.reduce((sum, b) => {
      return sum + Number(b[field] || 0)
    }, 0) / Math.max(1, data.length)
  )
}

export default avg
