const express = require('express')
const Discord = require('discord.js')

const svr = express()
const portNo = 8080

svr.get('/', (_, res) => {
    res.send('alive!')
})

svr.listen(portNo)

const client = new Discord.Client()

client.on('ready', () => {
    console.log('Bot ready.')
})

client.login(process.env.TOKEN)