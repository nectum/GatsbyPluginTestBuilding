module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-test',
      options: {
        projectId: 'vromr0qo',
        dataset: 'development',
        query: '*'
      }
    }
  ],
}
