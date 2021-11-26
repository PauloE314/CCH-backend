import joinParty from '../listeners/joinParty';
import TMiddleware from './TMiddleware';

const setupParty: TMiddleware = async (io, socket, storage, next) => {
  const { partyId } = socket.handshake.query;

  if (partyId) await joinParty(io, socket, storage, { partyId });
  next();
};

export default setupParty;
