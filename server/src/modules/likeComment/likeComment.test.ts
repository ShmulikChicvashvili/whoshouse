import { request, GraphQLClient } from 'graphql-request'
import { startServer } from '../../startServer'
import {
    loginMutationWithToken,
    registerMutation,
    likeComment,
    addPhoto
} from '../../utils/mutations'
import { Photo } from '../../entity/Photo'
import { Like } from '../../entity/Like'

let getHost = () => ''
let token = ''

const email = 'm@m.com'
const password = 'mm'
const fullname = 'Marcin Miler'
const username = 'Marcinek'

beforeAll(async () => {
    const app = await startServer()
    const { port } = app.address()
    getHost = () => `http://127.0.0.1:${port}/graphql`

    await request(
        getHost(),
        registerMutation(email, password, fullname, username)
    )

    await request(
        getHost(),
        registerMutation('a@a.com', 'aa', 'Angelika Miler', 'Angelaaa')
    )

    const login: any = await request(
        getHost(),
        loginMutationWithToken(email, password)
    )
    token = login.login.token
})

describe('Mutation likeComment', async () => {
    it('should like comment', async () => {
        const client = new GraphQLClient(getHost(), {
            headers: {
                token
            }
        })

        await client.request(addPhoto('lol.jpg', 'Wow'))

        const response = await client.request(likeComment(1))

        expect(response).toEqual({ likeComment: true })

        const photo = await Photo.findOneById(1, {
            relations: ['comments', 'comments.likes']
        })
        const like = await Like.find()

        expect(photo).toMatchSnapshot()
        expect(like).toHaveLength(1)
        expect(like).toMatchSnapshot()
    })

    it('should not like twice', async () => {
        const client = new GraphQLClient(getHost(), {
            headers: {
                token
            }
        })

        const response = await client.request(likeComment(1))

        expect(response).toEqual({ likeComment: false })

        const photo = await Photo.findOneById(1, {
            relations: ['comments', 'comments.likes']
        })
        const like = await Like.find()

        expect(photo).toMatchSnapshot()
        expect(like).toHaveLength(1)
        expect(like).toMatchSnapshot()
    })
})
