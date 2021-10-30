const { get } = require('lodash');
const { Client } = require('@notionhq/client');

const Parsers = {
  rich_text: (row) => get(row, 'rich_text[0].plain_text', ''),
  title: (row) => get(row, 'title[0].plain_text', ''),
  multi_select: (row) => get(row, 'multi_select', []).map((tag) => tag.name),
  number: (row) => get(row, 'number'),
  url: (row) => get(row, 'url'),
  files: (row) => get(row, 'files', []).map((d) => get(d, 'file.url')),
};

function createMapperFunction(parsers) {
  return function mapperFunc(item) {
    const parsed = {};

    const data = item.properties;

    Object.keys(data).forEach((prop) => {
      const parser = parsers[data[prop].type];

      parsed[prop] = parser(data[prop]);
    });

    return parsed;
  };
}

/**
 * Parses a Notion QueryResponse
 *
 * @param {object[]} notionDatabase
 * @param {Record<string, Function>} parsers
 * @return {object[]}
 */
function parseNotionDatabase(notionDatabase, parsers) {
  const mapperFunc = createMapperFunction(parsers);

  return notionDatabase.map(mapperFunc);
}

/**
 * Gets all pages from a database
 *
 * @param {Client} client
 * @param {string} databaseId
 * @param {object[]} [prevResults=[]]
 * @param {string} [nextCursor]
 */
async function getAllDatabasePages(client, databaseId, prevResults = [], nextCursor) {
  const queryParams = {
    database_id: databaseId,
  };

  if (nextCursor) {
    queryParams.start_cursor = nextCursor;
  }

  const tableContent = await client.databases.query(queryParams);

  if (tableContent.has_more) {
    return getAllDatabasePages(
      client, databaseId, [...prevResults, ...tableContent.results], tableContent.next_cursor,
    );
  }

  return [...prevResults, ...tableContent.results];
}

/**
 * Gets all the desired database data from Notion
 *
 * @template T
 * @param {string} notionApiToken Notion's API token
 * @param {string} notionDatabaseId Notion database ID to get results from
 * @param {Record<string, Function>} [parsers=Parsers] The custom parsers for your needs
 * @return {Promise<T[]>} The parsed database results
 */
async function getDataFromNotion(notionApiToken, notionDatabaseId, parsers = Parsers) {
  const notion = new Client({
    auth: notionApiToken,
  });

  const databaseId = notionDatabaseId;

  const results = await getAllDatabasePages(notion, databaseId, []);

  return parseNotionDatabase(results, parsers);
}

module.exports.getDataFromNotion = getDataFromNotion;
module.exports.Parsers = Parsers;
