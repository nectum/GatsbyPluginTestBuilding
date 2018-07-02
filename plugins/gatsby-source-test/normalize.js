const isImage = field => {
    return field._type !== undefined && field._type === 'image';
}

const addUrlToImageField = (field, baseImgUrl) => {
    if (field.asset) field.asset.assetUrl = `${baseImgUrl}/${field.asset._ref}`;
}

exports.normalizeField = (field, pluginOptions) => {

    const { projectId, dataset } = pluginOptions;
    const baseImgUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}`; 

    if (isImage(field))
        addUrlToImageField(field, baseImgUrl);



};