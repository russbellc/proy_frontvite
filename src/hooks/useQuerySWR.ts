import useSWR, { SWRConfiguration } from 'swr'

export const useQuerySWR = (query: string, config?: SWRConfiguration) => {
    const { data, error, isLoading} = useSWR(query, config)
    //return data, loading and error

    return {
        dataQuery: data,
        isLoadingQuery: isLoading,
        isErrorQuery: error,
    }

}