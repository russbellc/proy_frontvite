import { ApolloClient, InMemoryCache } from "@apollo/client";

const client1 = new ApolloClient({
    uri: "http://localhost:2002/",
    cache: new InMemoryCache()
})

export default client1;
