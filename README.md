## Node and TSO health monitor

Instructions

1. clone repo to desired location
2. Install dependencies:

```bash
yarn install
```

3. Fill out configuration arrays in configs.ts, either for node or TSO submission health. Arrays will be looped over and set up monitoring for each element.
4. Generate priceSubmitter factory typings

```bash
yarn run typechain
```

5. Setup telegram bot for notifications

   1. obtain token from @BotFather user on telegram by opening chat with him, writing /newbot and setting up name etc.
   2. copy token from chat into .env file under TELEGRAM_KEY=
   3. Google how to get chat id OR start app by `yarn run monit`, enter into chat with your bot from BotFather chat and write something. You should recieve a message with the chatId. Quit script.
   4. set chatId in .env under TELEGRAM_CHAT_ID=

6. Run monitor. At the moment only a single fail message will be sent to telegram (and one success message if it starts up again).

```bash
yarn run monit
```

Turbo boost it using pm2 so if it itself dies it will restart. Who watches the watcher? Dont feel like making a monitor for my monitor.

7. Enjoy

## Contributions

Feel free to contribute. Free use, except for Hiro with all his aliases + associates. Im sure this sentence will stop them.
