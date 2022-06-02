const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message })
  }

  next(err)
}

export default errorHandler
