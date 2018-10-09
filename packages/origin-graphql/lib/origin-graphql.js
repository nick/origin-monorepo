import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import link from './link'

const client = new ApolloClient({ link, cache: new InMemoryCache() })

export default client
