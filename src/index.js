const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const resolvers = {
    Query: {
        info: () => 'This is a sample API cloning Hackernews',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation: {
        createLink: (parent, args, context) => {
            const link = {
                description: args.description,
                url: args.url,
            }
            return context.prisma.link.create({
                data: link,
            })
        },
        updateLink: async (parent, args, context) => {
            const { id, url, description } = args
            const link = await context.prisma.link.update({
                where: {
                    id
                },
                data: {
                  url,
                  description
                }
              })
            if (link) {
                return link;
            }
        },
        deleteLink: async (parent, args, context) => {
            const { id } = args
            const link = await context.prisma.link.delete({
                where: {
                    id
                }
              })
            if (link) {
                return link
            }
        }
    },
    Link: {
        description: (parent) => parent.description.replace(/[a|e|i|o|u]/ig, '')
    }
}

const prisma = new PrismaClient()
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) => 
        console.log(`Server is running on ${url}`)
    );