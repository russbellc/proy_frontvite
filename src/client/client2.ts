import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
    uri: "http://localhost:2002/",
})

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
    });
    return forward(operation);
})

const client2 = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
})

export default client2;