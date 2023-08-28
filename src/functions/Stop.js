module.exports = async (thiswe, manager) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    thiswe.queue.set(`Queue_${manager.connection.guildId}`, []);
    thiswe.queue.set(`Loop_${manager.connection.guildId}`, false);
    thiswe.queue.set(`Volume_${manager.connection.guildId}`, 0.5);
    thiswe.queue.set(`Kobla_${manager.connection.guildId}`, true);
    await manager.stopTrack();
    return solve(true);
  });
};
