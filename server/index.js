var express = require("express");
var socket = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const PatchManager = require("./PatchManager");
const { SyncStateRemote } = require("@syncstate/remote-server");
const remote = new SyncStateRemote();
var app = express();
var server = app.listen(8000, function () {
  console.log("listening on port 8000");
});

var io = socket(server);
var projectId = uuidv4();

var patchManager = new PatchManager();

io.on("connection", async (socket) => {
  socket.on("fetchDoc", (path) => {
    //get all patches
    const patchesList = patchManager.getAllPatches(projectId, path);

    if (patchesList) {
      //send each patch to the client
      patchesList.forEach((change) => {
        socket.emit("change", path, change);
      });
    }
  });

  //patches recieved from the client
  socket.on("change", (path, change) => {
    change.origin = socket.id;

    //resolves conflicts internally
    remote.processChange(socket.id, path, change);
  });

  const dispose = remote.onChangeReady(socket.id, (path, change) => {
    //store the patches in js runtime or a persistent storage
    patchManager.store(projectId, path, change);

    //broadcast the pathes to other clients
    socket.broadcast.emit("change", path, change);
  });
});
