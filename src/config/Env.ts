export const Env = {
  logger: {
    elasticSearch: {
      url: process.env.ELASTIC_SEARCH_URL || 'http://localhost',
      port: process.env.ELASTIC_SEARCH_PORT || 9200,
      version: process.env.ELASTIC_SEARCH_VERSION || 7,
    },
  },
  app: {
    port: process.env.APP_PORT || 3000,
  },
};
