import useSWR, { SWRConfiguration } from 'swr'

export const useUserSWR = (query: string, config?: SWRConfiguration) => {
    const { data, error } = useSWR(query, config)
    return {
        dataUser: data,
        isLoadingUser: !error && !data,
        isErrorUser: error
    }
}