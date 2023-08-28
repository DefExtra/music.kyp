# music.kyp ✨

## Easy Discord Music Bot Building ✨🎶

## Introduction 🛠

`music.kyp` is a simple and powerful library designed to make building music bots for Discord using Lavalink easier.

## Installation and Usage 👨‍💻

### Installation:

You can install the library using npm with the following command:

```bash
npm install music.kyp
```

### Usage:

1. **Setting Up the Environment:**

   First, set up your default Discord.js environment:

   ```js
   const { Client, GatewayIntentBits } = require("discord.js");
   const client = new Client({
     intents: Object.keys(GatewayIntentBits),
     allowedMentions: { repliedUser: false },
   });

   client.login("<your discord bot token>");
   ```

2. **Importing and Using the `music.kyp` Library:**

   ```js
   const { Player } = require("music.kyp");

   const lavalink = {
     host: "lavalink.lexnet.cc",
     password: "lexn3tl@val!nk",
     port: 443,
     secure: true,
   };

   const player = new Player(client, [
     {
       name: lavalink.host,
       url: `${lavalink.host}:${lavalink.port}`,
       auth: lavalink.password,
       secure: lavalink.secure,
     },
   ]);
   ```

3. **Handling Events and Playing Music:**

   ```js
   // Handling Lavalink errors
   player.on("error", (e) => console.log(e));

   // When the music player is ready
   player.on("ready", (c) => {
     console.log("Connected to the kyp .");
   });

   // When Discord.js is ready
   client.on("ready", (c) => console.log("Connected to discord ."));

   // How to play music
   async function playMusic(Guild, voiceChannel, songName, metaData) {
     let manager = await player.manager(Guild.id, voiceChannel.id);
     let data = await player.search(manager, songName);
     if (!data.its_a_playlist) await player.play(manager, data, metaData);
   }

   // When a song is added to the queue
   player.on("addSong", (queue, track, metaData) => {
     console.log(queue);
     console.log(track);
   });

   // When a song starts playing
   player.on("playSong", (queue, track, metaData) => {
     console.log(queue);
     console.log(track);
   });
   ```

4. **Speech to text made easy with the kyp .**

```js
 // When discord be ready
 client.on("ready", () => {
  // Handling the speech constructor
  const speech = new Speech("<wit.ai token>", client);
  // Get the ai bot
  const bot = await speech.bot();
  // Make a connection with the bot and the voice channel
  const connection = await bot.join("<voiceChannel.id>");
  // Start the speech event, that emit when any one speake
  bot.startEvent(connection);


  speech.on("speech", (text, user) => {
    // text = string
    // user = Discord.js(User)

    // get a text channel to send the data
    let textChannel = client.channels.cache.get("<textChannel.id>");

    // send the data to the text channel
    textChannel.send(`<@${user.id}>, ${text}`)
  });
 })
```

## Why `music.kyp` 🤔

- Easy to use.
- Simplifies Lavalink functions.
- Simple and powerful.

## Get Started Now! 🚀

Utilize `music.kyp` to effortlessly build a fantastic music bot on Discord. Follow the steps outlined in the "Usage" section to try it out for yourself.

**Note:** Be sure to replace `<your discord bot token>` with your actual bot's token.
