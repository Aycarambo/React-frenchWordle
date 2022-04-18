function avg(data, field) {
  return data.reduce((a, b) => a[field] + b[field]) / data.length
}

export default avg
