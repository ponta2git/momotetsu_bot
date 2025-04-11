# 桃鉄抽選くん (Momotetsu Bot)

A Discord bot for Momotetsu Reiwa that assists with player selection and responds to specific phrases.

## Features

- Automatic response to specific Japanese phrases
- Random player selection for matches
- Simple webhook-based deployment

## Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/momotetsu_bot.git
cd momotetsu_bot
```

2. Install dependencies
```bash
npm install
```

3. Set up your Discord bot token as an environment variable
```bash
export TOKEN=your_discord_bot_token
```

## Usage

### Phrase Responses
The bot automatically responds to specific phrases in messages:

- When someone sends a message containing "マナー" → The bot replies with "スリの銀次"
- When someone sends a message containing "スリの銀次" → The bot replies with "マナー"

### Player Selection
To randomly select players for a match:

1. Mention the bot in your message
2. End your message with "抽選"

Example:
```
@MomotetsuBot 今日の参加者を抽選
```

The bot will reply with randomly selected players for today's match.

## Deployment

The bot includes a simple HTTP server on port 8080 to facilitate deployment on platforms that require a keep-alive mechanism.


## License

[MIT](LICENSE)
