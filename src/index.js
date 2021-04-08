const { ApolloServer } = require('apollo-server')

const typeDefs = `
    type Query {
        info: String!
        feed: [Link!]!
    }
    type Link {
        id: ID!
        description: String!
        url: String!
    }
`

const links = [{
    id: 'link-1',
    description: 'First link',
    url: 'https://www.example1.com',
}]

const resolvers = {
    Query: {
        info: () => 'This is a sample API cloning Hackernews',
        feed: () => links,
    },
    Link: {
        description: (parent) => parent.description.replace(/[a|e|i|o|u]/ig, '')
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );