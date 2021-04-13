const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')

let links = [{
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
        },
        updateLink: (parent, args) => {
            let linksMap = new Map(links.map((o) => [o.id, o]));
            let link = linksMap.get(args.id);
            if (link) {
                if (args.url &&
                    args.url !== link.url) {
                    link.url = args.url;
                }
                if (args.description &&
                    args.description !== link.description) {
                    link.description = args.description;
                }
                linksMap.set(args.id, link);
                links = Array.from(linksMap.values());
                return link;
            }
        },
        deleteLink: (parent, args) => {
            let linksMap = new Map(links.map((l) => [l.id, l]));
            const link = linksMap.get(args.id);
            if (link) {
                linksMap.delete(args.id);
                links = Array.from(linksMap.values());
                return link
            }
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