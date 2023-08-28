const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  VoiceConnection,
  EndBehaviorType,
} = require("@discordjs/voice");
const { Client } = require("discord.js");
const { EventEmitter } = require("node:events");
const { Readable } = require("node:stream");
const witClient = require("node-witai-speech");
const prism = require("prism-media");
const util = require("node:util");

class Transcriber {
  constructor(apiKey) {
    this.WITAPIKEY = apiKey;
    this.witAI_lastcallTS = null;

    return this;
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async convert_audio(input) {
    try {
      const data = new Int16Array(input);
      const ndata = new Int16Array(data.length / 2);
      for (let i = 0, j = 0; i < data.length; i += 4) {
        ndata[j++] = data[i];
        ndata[j++] = data[i + 1];
      }
      return Buffer.from(ndata);
    } catch (e) {
      console.log("Error: ", e);
      throw e;
    }
  }

  async transcribe(buffer, raw) {
    try {
      if (this.witAI_lastcallTS != null) {
        let now = Math.floor(new Date());
        while (now - this.witAI_lastcallTS < 1000) {
          await this.sleep(100);
          now = Math.floor(new Date());
        }
      }
      const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent);
      var stream = Readable.from(buffer);
      const contenttype =
        "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
      var output = await extractSpeechIntent(
        this.WITAPIKEY,
        stream,
        contenttype
      );
      this.witAI_lastcallTS = Math.floor(new Date());
      if (raw) return output;
      if (typeof output == "object") return output;
      output = output
        .split("\n")
        .map((item) => item.trim())
        .join("");
      let idx = output.lastIndexOf("}{");
      let idx0 = output.lastIndexOf("}");
      output = JSON.parse(
        output
          .substring(idx + 1, idx0 + 1)
          .trim()
          .replace(/\n/g, "")
          .trim()
      );
      output.text = output.text.replace(/\./g, "");
      stream.destroy();
      return output;
    } catch (e) {
      console.log("Error: ", e);
      return {};
    }
  }

  listen(receiver, userId, user) {
    return new Promise(async (res, rej) => {
      const stream = receiver.subscribe(userId, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 300,
        },
      });

      const decoder = new prism.opus.Decoder({
        frameSize: 960,
        channels: 2,
        rate: 48000,
      });
      stream.pipe(decoder);

      let buffer = [];
      decoder.on("data", (data) => {
        buffer.push(data);
      });
      decoder.on("end", async () => {
        buffer = Buffer.concat(buffer);
        const duration = buffer.length / 48000 / 2;
        if (duration > 1.0 || duration < 19) {
          let transcript = await this.transcribe(
            await this.convert_audio(buffer)
          );
          res({ user: user, transcript: transcript });
        }
      });
    });
  }
}

class Player extends EventEmitter {
  /**
   *
   * @param {string} wit_ai_api (you can get from here: https://wit.ai/)
   * @param {Client} DJSclient
   */
  constructor(wit_ai_api, DJSclient) {
    super();
    this.api = wit_ai_api;
    this.client = DJSclient;
  }

  async bot() {
    const transcriber = new Transcriber(this.api);
    const thiswe = this;
    return {
      /**
       *
       * @param {string} channelId
       * @returns {Promise<VoiceConnection>}
       */
      join: function (channelId) {
        return new Promise(async (resolve, reject) => {
          let channelBase = thiswe.client.channels.cache.get(channelId);
          if (!channelBase) return reject("Can't find this channel .");
          let guild = thiswe.client.guilds.cache.get(channelBase.guildId);
          if (!guild) return reject("Can't find this guild .");
          let channel = guild.channels.cache.get(channelBase.id);
          if (!channel) return reject("Can't find this channel .");
          let connection = await getVoiceConnection(guild.id);
          if (
            !connection ||
            !connection.state.status !== VoiceConnectionStatus.Ready
          )
            connection = await joinVoiceChannel({
              channelId: channel.id,
              guildId: channel.guild.id,
              adapterCreator: channel.guild.voiceAdapterCreator,
              selfDeaf: false,
              selfMute: false,
            });
          return resolve(connection);
        });
      },
      /**
       * @param {VoiceConnection} connection
       */
      startEvent: function (connection) {
        connection.receiver.speaking.on("start", (userId) => {
          transcriber
            .listen(
              connection.receiver,
              userId,
              thiswe.client.users.cache.get(userId)
            )
            .then((data) => {
              if (!data.transcript.text) return;
              thiswe.emit("speech", data.transcript.text, data.user);
            });
        });
      },
    };
  }
}

module.exports = Player;
