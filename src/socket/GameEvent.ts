enum GameEvent {
  NewParty = 'new-party',
  JoinParty = 'join-party',
  Disconnect = 'disconnect',
  ChatMessage = 'chat-message',
  PlayerLeave = 'player-leave',
  PlayerJoin = 'player-join',
  PartyId = 'party-id',
  Error = 'error',
}

export { GameEvent };

/*

const createNewPartyEvent = ({
  to,
  party,
}: {
  to: string;
  party: string;
}): Event<string> => ({
  type: GameEvent.NewParty,
  topic: to,
  payload: { party },
});
*/
