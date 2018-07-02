const { createRemoteFileNode } = require('gatsby-source-filesystem');
const imageUrlBuilder = require('@sanity/image-url');

/*
    Much of this file is inspired from, code which I take no credit from:
    https://github.com/angeloashmore/gatsby-source-prismic/blob/master/src/normalize.js
*/

const isImage = field => {
    return field._type !== undefined && field._type === 'image';
}

const normalizeImageField = async args => {

    const { field, imageBuilder, createNode, store, cache, touchNode, createNodeId } = args;

    if (!field.asset) return;

    const imageUrl = imageBuilder.image(field).url();
    field.asset.imageUrl = imageUrl;

    let fileNodeID;
    const mediaDataCacheKey = `sanity-media-${imageUrl}`;
    const cacheMediaData = await cache.get(mediaDataCacheKey);

    if (cacheMediaData) {
        fileNodeID = cacheMediaData.fileNodeID;
        touchNode({ nodeId: cacheMediaData.fileNodeID});
    }

    if (!fileNodeID) {
        try {
            const fileNode = await createRemoteFileNode({
                url: imageUrl,
                store,
                cache,
                createNode,
                createNodeId
            });

            if (fileNode) {
                fileNodeID = fileNode.id;
                await cache.set(mediaDataCacheKey, { fileNodeID });
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (fileNodeID) {
        field.asset.localFile___NODE = fileNodeID;
    }
};

exports.normalizeNode = async args => {
    const { node, client } = args;

    const imageBuilder = imageUrlBuilder(client);

    Object.keys(node).forEach(async key => {
        var field = node[key];
        
        if (isImage(field))
            await normalizeImageField({
                ...args,
                field,
                imageBuilder
            });
    });
          

};