module.exports = class PatchManager {
  // patches;
  constructor() {
    this.projectPatchesMap = new Map();
  }

  store(projectId, path, patch) {
    // console.log("storing patch", patch, this.projectPatchesMap);
    const projectPatches = this.projectPatchesMap.get(projectId);

    if (projectPatches) {
      const pathPatches = projectPatches.get(path);

      if (pathPatches) {
        pathPatches.push(patch);
      } else {
        projectPatches.set(path, [patch]);
      }
    } else {
      const pathPatchesMap = new Map();
      pathPatchesMap.set(path, [patch]);
      this.projectPatchesMap.set(projectId, pathPatchesMap);
    }
  }

  getAllPatches(projectId, path) {
    const projectPatches = this.projectPatchesMap.get(projectId);
    if (projectPatches) {
      const pathPatches = projectPatches.get(path);

      return pathPatches ? pathPatches : [];
    }

    return [];
  }
};
