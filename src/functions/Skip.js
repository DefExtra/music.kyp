module.exports = async (thiswe, manager) => {
  return new Promise(async (solve, ject) => {
    if (thiswe.system == false) return ject("verify required .");

    await manager.stopTrack();
    return solve(true);
  });
};
