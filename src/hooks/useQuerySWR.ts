import useSWR, { SWRConfiguration } from 'swr'

export const useQuerySWR = (query: string, config?: SWRConfiguration) => {
    const { data, error } = useSWR(query, config)
    return {
        dataQuery: data,
        isLoadingQuery: !error && !data,
        isErrorQuery: error
    }
}