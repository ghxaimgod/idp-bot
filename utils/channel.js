async function findGroupChannel(category, group) {

    const channels =
        [...category.children.cache.values()];

    return channels.find(channel => {

        const name =
            channel.name.toLowerCase();

        return name.endsWith(`${group}`);

    });

}

module.exports = {

    findGroupChannel

};
