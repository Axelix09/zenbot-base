import NodeCache from 'node-cache'

export const spamCache     = new NodeCache({ stdTTL: 60,  checkperiod: 30 })
export const warnCache     = new NodeCache({ stdTTL: 60,  checkperiod: 30 })
export const groupCache    = new NodeCache({ stdTTL: 600, checkperiod: 60 })
export const groupDbCache  = new NodeCache({ stdTTL: 300, checkperiod: 60, useClones: false })
export const msgRetryCache = new NodeCache({ stdTTL: 300, checkperiod: 60, useClones: false })
