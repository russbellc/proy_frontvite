import { GraphQLClient } from 'graphql-request';

const endPoint: string | undefined = import.meta.env.VITE_GRAPH_SERVER;

export const client3 = new GraphQLClient(`${endPoint}`);