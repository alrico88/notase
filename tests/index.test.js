const { getDataFromNotion } = require('../src');

describe('Test database downloading from Notion', () => {
  it('Should get data from an existing database', async () => {
    const data = await getDataFromNotion(process.env.NOTION_API_TOKEN, process.env.NOTION_TABLE_ID);

    expect(data.length).toBeGreaterThan(0);
  });

  it('Should have as many props as columns in database', async () => {
    const data = await getDataFromNotion(process.env.NOTION_API_TOKEN, process.env.NOTION_TABLE_ID);

    expect(Object.keys(data[0]).length).toBe(3);
  });
});
