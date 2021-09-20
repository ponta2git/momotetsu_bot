/* keep-aliving bot */
const http = require('http')

http.createServer((_, res) => {
    res.write("alive!")
    res.end()
}).listen(8080)

/* bot main */
const Discord = require('discord.js')
const client = new Discord.Client()

const sendGinji = msg => void msg.reply('スリの銀次')
const sendManner = msg => void msg.reply('マナー')
const parseMessage = msg => {
    if (msg.content.includes('マナー')) sendGinji(msg)
    else if (msg.content.includes('スリの銀次')) sendManner(msg)
}

const shuffle = ([...arr]) => {
    for (let i = arr.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
    }
    return arr
}
const electMembers = () => {
    const all = ['あかねまみ', 'いーゆー', 'おおたか']
    const CNT_MEMBERS = 2
    
    return shuffle(all).slice(0, CNT_MEMBERS)
}
const sendMembers = msg => void msg.reply(electMembers().join('、'))
const parseMention = msg => {
    if (msg.content.endsWith('抽選')) sendMembers(msg)
}

client.on('ready', () => {
    console.log('Bot ready.')
})

client.on('message', msg => {
    if (msg.author.bot) return
    if (msg.author.id === client.user.id) return
    if (msg.mentions.users.has(client.user.id)) parseMention(msg)
    else parseMessage(msg)
})

client.login(process.env.TOKEN)