module.exports = async (thiswe, guildId) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    return solve(thiswe.queue.get(`Queue_${guildId}`));
  });
};
