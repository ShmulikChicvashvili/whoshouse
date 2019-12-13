import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import * as SecureStore from 'expo-secure-store'

export const client = new ApolloClient({
    uri: 'http://172.20.10.4:4000/graphql',
    fetchOptions: {
        credentials: 'include',
        fetchPolicy: "no-cache"
    },
    request: async operation => {
        const token = await SecureStore.getItemAsync('token')

        operation.setContext({
            headers: {
                token: token ? token : ''
            }
        })
    }
})
