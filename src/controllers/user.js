module.exports = {
  createUser: (req, res) => {
    const results = req.body
    res.send({
      success: true,
      message: `You've been successfully registered`,
      results
    })
  }
}