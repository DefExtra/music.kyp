const Spotify = require("spotifydl-x").default;

module.exports = async (thiswe, manager, uri) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");
    const node = thiswe.player.getNode();
    if (!node) ject("no available nodes .");
    let engine = "ytsearch";
    let ier = uri;
    if (
      uri.includes("http") ||
      uri.includes("https") ||
      uri.includes("http://") ||
      uri.includes("https://")
    ) {
      if (
        uri.includes("soundcloud.com") ||
        uri.includes("spotify.com") ||
        uri.includes("youtube.com") ||
        uri.includes("youtu.be")
      ) {
      } else ject("un supported uri");
    }
    if (uri.includes("soundcloud.com")) {
      if (uri.includes("sets") || uri.includes("/sets/")) {
        await thiswe.itsAsoundcloudPlaylist(uri, node, manager);
        return solve({
          its_a_playlist: true,
        });
      } else {
        scdl.setClientID(thiswe.sources.souncloud.clientId);
        ier = (await scdl.getInfo(uri))?.title;
      }
      engine = "scsearch";
    }
    if (uri.includes("spotify.com")) {
      const spotify = new Spotify(thiswe.sources.spotify);

      if (uri.includes("playlist") || uri.includes("/playlist/")) {
        await thiswe.itsAspotifydPlaylist(uri, spotify, node, manager);
        return solve({
          its_a_playlist: true,
        });
      } else {
        let meta = await spotify.getTrack(uri);
        ier = meta.name + " " + meta.artists;
      }
    }
    if (ier.includes("youtube.com") || ier.includes("youtu.be")) {
      if (ier.includes("&list")) ier = ier.split("&list")[0];
    }
    const result = await node.rest.resolve(`${engine}:${ier}`);
    if (!result?.tracks.length) return solve(null);

    let obj = result.tracks.shift();
    if (uri.includes("spotify.com")) {
      obj.info.sourceName = "spotify";
    }
    if (uri.includes("soundcloud.com")) {
      obj.info.sourceName = "souncloud";
    }

    let data = {
      engine,
      its_a_playlist: false,
      track: obj.track,
      author: obj.info.author,
      isStream: obj.info.isStream,
      sourceName: obj.info.sourceName,
      position: obj.info.position,
      length: obj.info.length,
      title: obj.info.title,
      url: obj.info.uri,
    };
    return solve(data);
  });
};
