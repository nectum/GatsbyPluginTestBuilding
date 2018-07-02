exports.fetchData = async (pluginOptions, client) => {
    const { projectId, dataset, query } = pluginOptions;

    console.time(`Fetch Sanity data`);
    console.log(`Fetching Sanity data from project ${projectId} with dataset ${dataset}`);

    const documents = await client.fetch(`${query}`);

    console.timeEnd(`Fetch Sanity data`);

    return {
        documents
    }
};