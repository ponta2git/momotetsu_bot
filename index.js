const http = require('http')

http.createServer((_, res) => {
    res.write("alive!")
    res.end()
}).listen(8080)


const Discord = require('discord.js')
const client = new Discord.Client()

const sendPong = msg => {
    msg.reply('pong')
}

const parseMessage = msg => {
    if (msg.content.startsWith('ping')) sendPong(msg)
}

client.on('ready', () => {
    console.log('Bot ready.')
})

client.on('message', msg => {
    // if (msg.author.bot) return
    if (msg.author.id === Discord.ClientUser.id) {
        console.log("my message.")
        return
    }

    parseMessage(msg)
})

client.login(process.env.TOKEN)