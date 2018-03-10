const http = require('http')
const Bot = require('messenger-bot')

const port = 5000;

let bot = new Bot({
  token: 'EAAInIgwoANcBAK9EtwDBzoaL0EI5j8BAZCaXu9VX5vQUjnQJtywnDMLf8oyTytOGj4fE113FXL8CUP6YSA90la8OENfA6sCLIvGpNIvx5vsvNiUsWnCG5J6Uic5OMpMANa0bvfWXTJ60r5zHK9urPXDztu9y4umctgd9UUQZDZD',
  verify: 'tuxedo_cat',
  app_secret: ''
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(port)
console.log('Echo bot server running at port ' + port + '.')
