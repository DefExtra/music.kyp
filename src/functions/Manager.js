module.exports = async (thiswe, guildId, voiceChannelId, options) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    if (!options?.deaf) options.deaf = true;
    if (!options?.mute) options.mute = false;
    const node = thiswe.player.getNode();
    if (!node) ject("no available nodes .");
    let manager = node.players.get(guildId);
    if (!manager)
      manager = await node.joinChannel({
        channelId: voiceChannelId,
        guildId,
        deaf: options?.deaf,
        mute: options?.mute,
        shardId: 0,
      });
    thiswe.queue.set(`Kobla_${manager.connection.guildId}`, false);
    return solve(manager);
  });
};
