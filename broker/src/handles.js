const { redisClient } = require("./db");
const { promisify } = require("util");
const redisGetAsync = promisify(redisClient.get).bind(redisClient);
const redisSetAsync = promisify(redisClient.set).bind(redisClient);
const redisDelAsync = promisify(redisClient.del).bind(redisClient);
const redisSetbitAsync = promisify(redisClient.setbit).bind(redisClient);
const redisGetbitAsync = promisify(redisClient.getbit).bind(redisClient);

const handles = {
  newPeer: async socketId => {
    if (socketId) {
      // Get pos not yet keep
      let posPeer;
      while (true) {
        const randomOffset = parseInt(Math.random() * (99999 - 1) + 1);
        const value = parseInt(
          await redisGetbitAsync(["peerTrack", randomOffset])
        );
        if (!value) {
          posPeer = randomOffset;
          break;
        }
      }

      await redisSetAsync([
        socketId,
        JSON.stringify({
          posPeer
        })
      ]);
      await redisSetAsync([posPeer, socketId]);
      await redisSetbitAsync(["peerTrack", posPeer, 1]);
      return posPeer;
    }

    return undefined;
  },
  deletePeer: async socketId => {
    if (socketId) {
      let socketData = (await redisGetAsync([socketId])) || "";
      await redisDelAsync(socketId);

      if (socketData) {
        socketData = JSON.parse(socketData);
        const { posPeer } = socketData;
        await redisDelAsync(posPeer);
        await redisSetbitAsync(["peerTrack", posPeer, 0]);
      }
    }
  },
  setSignal: async (socketId, signal) => {
    if (socketId && signal) {
      let socketData = await redisGetAsync([socketId]);
      if (socketData) {
        socketData = JSON.parse(socketData);
        await redisSetAsync([
          socketId,
          JSON.stringify({
            ...socketData,
            signalInit: signal
          })
        ]);

        return socketData.posPeer;
      }
    }

    return undefined;
  },
  getSignal: async posPeer => {
    if (posPeer) {
      const socketID = (await redisGetAsync([posPeer])) || "";
      let socketData = await redisGetAsync([socketID]);
      if (socketData) {
        socketData = JSON.parse(socketData);
        return socketData.signalInit;
      }
    }

    return undefined;
  },
  getSocketIDByPosPeer: async posPeer => {
    if (posPeer) {
      return await redisGetAsync([posPeer]);
    }

    return undefined;
  }
};

module.exports = handles;
