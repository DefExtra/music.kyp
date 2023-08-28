const playerF = require("music.kyp/src/functions/Player");

module.exports = async (thiswe, manager, track, metadata) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");
    let serverQueue =
      thiswe.queue.get(`Queue_${manager.connection.guildId}`) || [];
    serverQueue.push(track);
    thiswe.queue.set(`Queue_${manager.connection.guildId}`, serverQueue);
    solve(true);
    if (
      (thiswe.queue.get(`Queue_${manager.connection.guildId}`) || []).length ==
      1
    )
      playerF(
        thiswe,
        manager,
        thiswe.queue.get(`Queue_${manager.connection.guildId}`) || [],
        metadata
      );
    else
      thiswe.emit(
        "addSong",
        thiswe.queue.get(`Queue_${manager.connection.guildId}`) || [],
        track,
        metadata
      );
  });
};
