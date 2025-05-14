import {knex as knexConig} from 'knex'

import config from '../../knexfile'

export const knex = knexConig(config)