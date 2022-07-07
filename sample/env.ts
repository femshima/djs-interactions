import readenv from '@cm-ayf/readenv';
import dotenv from 'dotenv';

dotenv.config();

const env = readenv({
  BOT_TOKEN: {},
  production: {
    from: 'NODE_ENV',
    default: false,
    parse: (s) => s === 'production',
  },
});

export default env;
