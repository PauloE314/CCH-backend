import { errorCodes, gameSettings } from '~/config/settings';
import { GameEvent } from '../GameEvent';
import { GameSocket } from '../GameSocket';

const { maxPlayerAmount } = gameSettings;

const joinParty = ({ io, socket, storage }: GameSocket) =>
  socket.on(GameEvent.JoinParty, async ({ partyId }) => {
    const player = await storage.get('players', socket.id);
    const party = await storage.get('parties', partyId);

    if (!player) return;

    if (!party) {
      socket.emit('error', errorCodes.inexistentParty);
      return;
    }

    if (player.partyId) {
      socket.emit(GameEvent.Error, errorCodes.inParty);
      return;
    }

    const playerAmount = (await party.players(storage)).length;
    if (playerAmount > maxPlayerAmount) {
      socket.emit(GameEvent.Error, errorCodes.PartyTooLarge);
      return;
    }

    player.partyId = party.id;
    party.playerIds.push(player.id);
    socket.join(party.id);
    socket.emit('party-id', party.id);

    const data = {
      ownerId: party.ownerId,
      allPlayers: await party.players(storage),
      player,
    };

    party.sendToAll(io, GameEvent.PlayerJoin, data);
  });

export default joinParty;
