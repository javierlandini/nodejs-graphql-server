function info() {
    return 'This is a sample API cloning Hackernews'
}

function feed(parent, args, context)  {
    return context.prisma.link.findMany()
}

module.exports = {
    info,
    feed,
}