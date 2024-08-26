import { GraphQLClient } from 'graphql-request';

const endPoint: string | undefined = "http://localhost:2002/";
// const endPoint: string | undefined = process.env.NEXT_PUBLIC_CLIENT_GRAPHQL_URL;
export const client3 = new GraphQLClient(`${endPoint}`);