import { ApolloClient, InMemoryCache } from "@apollo/client";

const client1 = new ApolloClient({
    uri: import.meta.env.VITE_GRAPH_SERVER,
    cache: new InMemoryCache()
})

export default client1;
