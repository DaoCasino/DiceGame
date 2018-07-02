'use strict'
module.exports = {
  NODE_ENV: '"production"',
  DC_NETWORK: `"${process.env.DC_NETWORK}"` || '"local"'
}
