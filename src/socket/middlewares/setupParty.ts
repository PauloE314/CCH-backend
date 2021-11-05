import joinParty from '../listeners/joinParty';
import TMiddleware from './TMiddleware';

const setupParty: TMiddleware = (io, socket, storage, next) => {
  const { partyId } = socket.handshake.query;

  if (partyId) joinParty(io, socket, storage, { partyId });
  next();
};

export default setupParty;
