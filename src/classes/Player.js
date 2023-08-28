const { Client } = require("discord.js");
const { EventEmitter } = require("node:events");
const { Shoukaku, Connectors, Node } = require("shoukaku");
const { default: SpotifyFetcher } = require("spotifydl-x/dist/Spotify");
const credentials = {
  clientId: "a550048a0778496e80a7d0835596f930",
  clientSecret: "ccd62ea656104e948d15d665b3bff8c3",
};
const client_id = "ac9Aijg8tIyLGkyXvB3LptOl13ZDUHL5";
const scdl = require("soundcloud-downloader").default;
const scCx = require("music.kyp/src/functions/SoundCloudSetsPlayer");
const spCx = require("music.kyp/src/functions/spotifySetsPlayer");
const Search = require("music.kyp/src/functions/Search");
const ManagerX = require("music.kyp/src/functions/Manager");
const Play = require("music.kyp/src/functions/Play");
const Stop = require("music.kyp/src/functions/Stop");
const Skip = require("music.kyp/src/functions/Skip");
const Clear = require("music.kyp/src/functions/Clear");
const Loop = require("music.kyp/src/functions/Loop");
const Queue = require("music.kyp/src/functions/Queue");

class Player extends EventEmitter {
  /**
   *
   * @param {Client} DJSclient
   * @param {[{
   *  name: string,
   *  url: string,
   *  auth: string,
   *  secure: boolean
   * }]} nodes
   * @param {{
   *  spotify: {
   *     clientId: string,
   *     clientSecret: string
   *  }
   *  souncloud: {
   *     clientId: string
   *  }
   *  genius: {
   *     token: string
   *  }
   * }} sources
   */
  constructor(DJSclient, nodes, sources) {
    super();
    if (!DJSclient) throw Error("Missing Discord.js client .");
    if (!nodes || !nodes[0]?.auth || !nodes[0]?.url || !nodes[0]?.auth)
      throw Error("Missing Nodes or one of there options .");
    this.sources = {
      spotify: credentials,
      souncloud: {
        clientId: client_id,
      },
      genius: {
        apiKey:
          "aJosvThg-_g3cB2YIs401xChcQGHD-21ucnAS3LIc1xlpmzvbn8N-Qod2dr-LQ95",
        optimizeQuery: true,
      },
    };
    if (sources?.spotify) this.sources.spotify = sources?.spotify;
    if (sources?.genius) this.sources.genius = sources?.genius;
    if (sources?.souncloud) this.sources.souncloud = sources?.souncloud;

    const shoukaku = new Shoukaku(new Connectors.DiscordJS(DJSclient), nodes);
    this.system = true;
    this.player = shoukaku;
    this.nodes = nodes;
    this.client = DJSclient;
    this.queue = new Map();
    shoukaku.on("error", (_, error) => this.emit("error", error));
    shoukaku.on("ready", () => this.emit("ready", null));
  }

  /**
   *
   * @param {string} uri
   * @returns {boolean}
   */
  async isPlaylist(uri) {
    if (uri.includes("spotify.com") && uri.includes("/playlist/")) return true;
    else if (uri.includes("soundcloud.com") && uri.includes("/sets/"))
      return true;
    else return false;
  }

  /**
   *
   * @param {string} uri
   * @param {Node} node
   * @returns {Promise<{
   *  its_a_soundcloud_playlist: true,
   *  tracks: [{
   *  track: string,
   *  author: string,
   *  isStream: boolean,
   *  sourceName: string,
   *  position: string,
   *  length: number,
   *  title: string,
   *  url: string,
   * }]
   * }>}
   */
  async itsAsoundcloudPlaylist(uri, node, manager) {
    return scCx(scdl, this, node, manager, uri);
  }

  /**
   *
   * @param {string} uri
   * @param {SpotifyFetcher} spotify
   * @param {Node} node
   * @returns {Promise<{
   *  its_a_spotify_playlist: true,
   *  tracks: [{
   *  track: string,
   *  author: string,
   *  isStream: boolean,
   *  sourceName: string,
   *  position: string,
   *  length: number,
   *  title: string,
   *  url: string,
   * }]
   * }>}
   */
  async itsAspotifydPlaylist(uri, spotify, node, manager) {
    return spCx(spotify, uri, this, manager, node);
  }

  /**
   * @param {import("shoukaku").Player} manager
   * @param {string} uri
   * @returns {Promise<{
   *  its_a_playlist: boolean,
   *  track: string,
   *  author: string,
   *  isStream: boolean,
   *  sourceName: string,
   *  position: string,
   *  length: number,
   *  title: string,
   *  url: string,
   * }> | Promise<{
   *  its_a_playlist: true,
   * }>}
   */
  async search(manager, uri) {
    return Search(this, manager, uri);
  }

  /**
   *
   * @param {string} guildId
   * @param {string} voiceChannelId
   * @param {{deaf:boolean,mute:boolean}} options
   * @returns {Promise<import("shoukaku").Player>}
   */
  async manager(
    guildId,
    voiceChannelId,
    options = {
      deaf: true,
      mute: false,
    }
  ) {
    return ManagerX(this, guildId, voiceChannelId, options);
  }

  /**
   *
   * @param {import("shoukaku").Player} manager
   * @param {{
   *     engine: string,
   *     track: string,
   *     author: string,
   *     isStream: string,
   *     sourceName: string,
   *     position: string,
   *     length: string,
   *     title: string,
   *     url: string,
   *   }} track
   */
  async play(manager, track, metadata) {
    return Play(this, manager, track, metadata);
  }

  /**
   *
   * @param {import("shoukaku").Player} manager
   */
  async stop(manager) {
    return Stop(this, manager);
  }

  /**
   *
   * @param {import("shoukaku").Player} manager
   */
  async skip(manager) {
    return Skip(this, manager);
  }

  /**
   *
   * @param {import("shoukaku").Player} manager
   */
  async clear(manager) {
    return Clear(this, manager);
  }

  /**
   *
   * @param {string} guildId
   * @returns {Promise<{
   *     engine: string,
   *     track: string,
   *     author: string,
   *     isStream: string,
   *     sourceName: string,
   *     position: string,
   *     length: string,
   *     title: string,
   *     url: string,
   *   }[]>}
   */
  async getQueue(guildId) {
    return Queue(this, guildId);
  }

  /**
   *
   * @param {string} guildId
   * @param {boolean} status
   * @returns {Promise<Map<any, any>>}
   */
  async loop(guildId, status) {
    return Loop(this, guildId, status);
  }
}

module.exports = Player;
