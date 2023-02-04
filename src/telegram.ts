import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// replace the value below with the Telegram token you receive from @BotFather
const token = "YOUR_TELEGRAM_BOT_TOKEN";

// Create a bot that uses 'polling' to fetch new updates
let bot: TelegramBot;

export const startTelegramBot = () => {
  if (process.env.TELEGRAM_KEY) {
    bot = new TelegramBot(process.env.TELEGRAM_KEY, { polling: true });
    bot.on("message", (msg) => {
      const chatId = msg.chat.id;

      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, `Received your message, chatId: ${chatId}`);
    });
  } else {
    console.log("no telegram api key provided");
  }
  if (!process.env.TELEGRAM_CHAT_ID) {
    console.log("no telegram chat id provided");
  }
};

export const sendMessageToTelegramBot = (message: string) => {
  if (process.env.TELEGRAM_KEY && process.env.TELEGRAM_CHAT_ID) {
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  }
};
