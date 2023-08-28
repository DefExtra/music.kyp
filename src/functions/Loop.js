module.exports = async (thiswe, guildId, status) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    return solve(thiswe.queue.set(`Loop_${guildId}`, status));
  });
};
