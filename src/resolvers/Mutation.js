const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) {
        throw new Error('Wrong email and/or password.')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Wrong email and/or password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

function createLink(parent, args, context) {
    const { userId } = context;
    const link = {
        description: args.description,
        url: args.url,
        postedBy: { connect : { id : userId } },
    }
    return context.prisma.link.create({
        data: link,
    })
}

async function updateLink(parent, args, context) {
    const { userId } = context;
    const { id, url, description } = args
    let link = await context.prisma.link.findUnique({ where : { id } })
    if (!link || link.postedById != userId) {
        throw new Error('No link found')
    }
    link = await context.prisma.link.update({
        where: {
            id,
        },
        data: {
          url,
          description
        }
      })
    if (link) {
        return link;
    }
}

async function deleteLink(parent, args, context) {
    const { userId } = context
    const { id } = args
    let link = await context.prisma.link.findUnique({ where : { id } })
    if (!link || link.postedById != userId) {
        throw new Error('No link found')
    }
    link = await context.prisma.link.delete({
        where: {
            id,
        }
      })
    if (link) {
        return link
    }
}

module.exports = {
    signup,
    login,
    createLink,
    updateLink,
    deleteLink,
}