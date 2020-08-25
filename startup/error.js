module.exports = function() {
  process.on('uncaughtException', err => {
    console.log(err)
    process.exit(1)
  })
  process.on('unhandledRejection', err => {
    throw err
  })
}