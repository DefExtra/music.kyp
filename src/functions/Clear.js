module.exports = async (thiswe, manager) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    thiswe.queue.set(`Queue_${manager.connection.guildId}`, []);
    return solve(true);
  });
};
