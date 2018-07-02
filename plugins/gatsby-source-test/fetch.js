const sanityClient = require('@sanity/client');

exports.fetchData = async ({ projectId, dataset }) => {
    console.time(`Fetch Sanity data`);
    console.log(`Fetching Sanity data from project ${projectId} with dataset ${dataset}`);

    const client = sanityClient({ projectId, dataset });

    const documents = await client.fetch('*[_type in ["movie"]]');

    console.timeEnd(`Fetch Sanity data`);

    return {
        documents
    }
};