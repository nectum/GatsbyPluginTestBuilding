const createNodeHelpers = require('gatsby-node-helpers').default;
const sanityClient = require('@sanity/client');
const { fetchData } = require('./fetch');
const { normalizeNode } = require('./normalize');

const nodeHelpers = createNodeHelpers({ typePrefix: 'Sanity'});
const { createNodeFactory, generateNodeId } = nodeHelpers;

exports.sourceNodes = async (gatsby, pluginOptions) => {
    
    const { actions, store, cache, createNodeId } = gatsby;
    const { createNode, touchNode } = actions;
  
    const { projectId, dataset} = pluginOptions;
  
    // Create the sanityClient for continueous use
    const client = sanityClient({ projectId, dataset });

    // Get the relevant documents from Sanity
    const { documents } = await fetchData(pluginOptions, client);

    await Promise.all(
      documents.map(async doc => {
        const Node = createNodeFactory(doc._type, async node => {

          if (node === undefined || node === null)
            return node;

          node.id = generateNodeId(doc._type, doc._id);
          
          await normalizeNode({
            node, 
            client,
            createNode,
            store,
            cache,
            touchNode,
            createNodeId,
            nodeHelpers
          });

          //console.log(node);

          return node;
        });

        const node = await Node(doc);
        createNode(node);
      })
    );

    return;
  }
