module.exports = async (spotify, uri, thiswe, manager, node) => {
  let meta = await spotify.getPlaylist(uri);
  return new Promise(async (solve, ject) => {
    let leng = meta.tracks.length;
    for (let index = 0; index < leng; index++) {
      const element = meta.tracks[index];
      let track = await spotify.getTrack(
        "https://open.spotify.com/track/" + element
      );
      const result = await node.rest.resolve(
        `ytsearch:${track.name} ${track.artists}`
      );
      if (!result?.tracks.length) return;
      let obj = result.tracks.shift();
      let data = {
        itsAplaylist: true,
        engine: "ytsearch",
        track: obj.track,
        author: obj.info.author,
        isStream: obj.info.isStream,
        sourceName: obj.info.sourceName,
        position: obj.info.position,
        length: obj.info.length,
        title: obj.info.title,
        url: uri,
      };
      if (thiswe.queue.get(`Kobla_${manager.connection.guildId}`)) {
        leng = 0;
      } else {
        await thiswe.play(manager, data);
      }
    }
  });
};
