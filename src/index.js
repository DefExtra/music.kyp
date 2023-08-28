"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.KypEvents = exports.Speech = void 0;
var player_1 = require("./classes/Player");
Object.defineProperty(exports, "Player", {
  enumerable: true,
  get: function () {
    return player_1;
  },
});
var speech_1 = require("./classes/Speech");
Object.defineProperty(exports, "Speech", {
  enumerable: true,
  get: function () {
    return speech_1;
  },
});
Object.defineProperty(exports, "KypEvents", {
  enumerable: true,
  get: function () {
    return {
      Error: "error",
      Ready: "ready",
      Speech: "speech",
      PlaySong: "playSong",
      AddSong: "addSong",
    };
  },
});
