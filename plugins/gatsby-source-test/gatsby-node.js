const createNodeHelpers = require('gatsby-node-helpers').default;
const { fetchData } = require('./fetch');
const { normalizeField } = require('./normalize');

const nodeHelpers = createNodeHelpers({ typePrefix: 'Sanity'});
const { createNodeFactory, generateNodeId } = nodeHelpers;

exports.sourceNodes = async (gatsby, pluginOptions) => {
    
    const { actions, store, cache, createNodeId } = gatsby;
    const { createNode, touchNode } = actions;
  
    const { projectId, dataset } = pluginOptions;
  
    const { documents } = await fetchData({ projectId, dataset });

    await Promise.all(
      documents.map(async doc => {
        const Node = createNodeFactory(doc._type, async node => {

          node.id = generateNodeId(doc._type, doc._id);
          
          Object.keys(node).forEach(key => normalizeField(node[key], pluginOptions));
          
          console.log(node);

          return node;
        });

        const node = await Node(doc);
        createNode(node);
      })
    );

    return;
  }
