import { Middleware } from '.';
import { ErrorCodes } from '../EventManager';
import { getUsername } from '../helpers';

const nameValidation: Middleware = ({ socket }, next) => {
  const username = getUsername(socket);

  if (username === 'undefined') {
    return next(new Error(`${ErrorCodes.invalidData}`));
  }

  next();
};

export { nameValidation };
