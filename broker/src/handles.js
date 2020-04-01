const { db, peers } = require('./db')
const handles = {
  newPeer: (socketId) => {
    if (socketId) {
      const peer = peers
        .insert({
          socketId
        })
        .write()
      return peer.id
    }
    return undefined
  },
  deletePeer: (socketId) => {
    if (socketId) peers.remove({ socketId }).write()
  },
  setSignal: (socketId, signal) => {
    if (socketId && signal) return peers.find({ socketId }).assign({ signalInit: signal }).write()
    return undefined
  },
  getSignal: (peerId) => {
    if (peerId) return peers.getById(peerId).value().signalInit
    return undefined
  }
}

module.exports = handles
