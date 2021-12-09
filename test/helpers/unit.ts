import { mocked } from 'ts-jest/utils';
import { GameContext } from '~/socket/GameContext';
import { Listener } from '~/socket/listeners';

function runListener(context: GameContext, listener: Listener, data?: any) {
  listener(context);
  const cb = mocked(context.socket.on).mock.calls[0][1];
  cb(data);
}

export { runListener };
