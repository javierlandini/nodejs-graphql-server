const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')

const links = [{
    id: 'link-0',
    description: 'First link',
    url: 'https://www.example1.com',
}]

const resolvers = {
    Query: {
        info: () => 'This is a sample API cloning Hackernews',
        feed: () => links,
    },
    Mutation: {
        createLink: (parent, args) => {
            const link = {
                id: `link-${links.length}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        }
    },
    Link: {
        description: (parent) => parent.description.replace(/[a|e|i|o|u]/ig, '')
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );