import { Middleware } from '.';
import { ErrorCodes } from '../Events';
import { getUsername } from '../helpers/socket';

const nameValidation: Middleware = ({ socket }, next) => {
  const username = getUsername(socket);

  if (username === 'undefined') {
    return next(new Error(`${ErrorCodes.invalidData}`));
  }

  next();
};

export { nameValidation };
