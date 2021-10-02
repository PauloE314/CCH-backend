if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import Application from './app';

const application = new Application();

application.boot();
application.run(process.env.PORT || 3000);
