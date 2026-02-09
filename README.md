# Telegram bot for getting Steam account information

## Tech Stack 

- JavaScript / TypeScript
- Node.js

## APIs Used

- Steam API
- node-telegram-bot-api

# Project Structure

## bot.ts
- Handles basic logic with messages from user
- Uses message editing instead of sending new messages to keep the chat clean
- Provides smooth animations and clear user interaction

## player.ts
- Defines the Player class and data containers
- Contains a final function that returns structured player data from the API

## steamRequest.ts 

- Handles requests to the Steam API
- Fetches Steam account information

### token.ts 

- Stores the bot token (not committed to the repository)