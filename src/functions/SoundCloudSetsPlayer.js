module.exports = async (scdl, thiswe, node, manager, uri) => {
  scdl.setClientID(thiswe.sources.souncloud.clientId);
  return new Promise(async (solve, ject) => {
    let leng = (await scdl.getSetInfo(uri)).tracks.length;
    for (let index = 0; index < leng; index++) {
      const element = (await scdl.getSetInfo(uri)).tracks[index];
      const result = await node.rest.resolve(`scsearch:${element.title}`);
      if (!result?.tracks.length) return;
      let obj = result.tracks.shift();
      let data = {
        itsAplaylist: true,
        engine: "scsearch",
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
