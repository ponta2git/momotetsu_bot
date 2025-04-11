// HTTP Server to keep the bot alive
import http from 'http';
import { Client, GatewayIntentBits, Events } from 'discord.js';

// Keep-alive server
http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("alive!");
    res.end();
}).listen(8080, () => console.info('Keep-alive server running on port 8080'));

/* Bot Configuration */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Message response handlers
const messageHandlers = {
    sendGinji: msg => msg.reply('スリの銀次'),
    sendManner: msg => msg.reply('マナー'),
    
    parseMessage: msg => {
        try {
            if (msg.content.includes('マナー')) return messageHandlers.sendGinji(msg);
            if (msg.content.includes('スリの銀次')) return messageHandlers.sendManner(msg);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }
};

// Member selection utilities
const memberUtils = {
    shuffle: (arr) => {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    },
    
    electMembers: (count = 2) => {
        const all = ['あかねまみ', 'いーゆー', 'おおたか'];
        return memberUtils.shuffle(all).slice(0, count);
    },
    
    sendMembers: async (msg) => {
        try {
            const members = memberUtils.electMembers();
            await msg.reply(members.join('、'));
        } catch (error) {
            console.error('Error sending members:', error);
            await msg.reply('メンバー抽選中にエラーが発生しました。');
        }
    }
};

// Mention handlers
const mentionHandlers = {
    parseMention: async (msg) => {
        try {
            if (msg.content.endsWith('抽選')) {
                await memberUtils.sendMembers(msg);
            }
        } catch (error) {
            console.error('Error parsing mention:', error);
        }
    }
};

// Event handlers
const setupEventHandlers = () => {
    client.once(Events.ClientReady, () => {
        console.info(`Bot ready. Logged in as ${client.user.tag}`);
    });
    
    client.on(Events.MessageCreate, async (msg) => {
        // Ignore messages from bots or self
        if (msg.author.bot || msg.author.id === client.user?.id) return;
        
        try {
            if (msg.mentions.users.has(client.user.id)) {
                await mentionHandlers.parseMention(msg);
            } else {
                messageHandlers.parseMessage(msg);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });
    
    // Error handling
    client.on(Events.Error, error => {
        console.error('Discord client error:', error);
    });
};

// Initialize and start the bot
const initBot = async () => {
    try {
        setupEventHandlers();
        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
};

// Start the bot
initBot();