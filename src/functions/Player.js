const { EventEmitter } = require("node:events");

/**
 *
 * @param {EventEmitter} events
 * @param {import("shoukaku").Player} player
 * @param {Map} queue
 * @param {boolean} loop
 */
module.exports = async function playerF(events, player, queue, metadata) {
  let track = queue[0];
  if (!track) return;
  await player.playTrack({ track: track.track });
  await player.setVolume(0.5);
  events.emit("playSong", queue, track, metadata);
  player.once("end", () => {
    let loop = events.queue.get(`Loop_${player.connection.guildId}`) || false;
    if (loop == false) queue.shift();
    playerF(
      events,
      player,
      events.queue.get(`Queue_${player.connection.guildId}`),
      metadata
    );
  });
};
