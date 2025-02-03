import { GraphQLClient } from 'graphql-request';

// const endPoint: string | undefined = "https://backend-crox.up.railway.app/"
const endPoint: string | undefined = "http://localhost:4000/"
// const endPoint: string | undefined = import.meta.env.VITE_GRAPH_SERVER

export const client3 = new GraphQLClient(`${endPoint}`);