const http = require('http')

http.createServer((_, res) => {
    res.write("alive!")
    res.end()
}).listen(8080)

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log('Bot ready.')
})

client.login(process.env.TOKEN)