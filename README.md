# notase

Easily use a Notion table as a database.

## Installation

```javascript
const { getDataFromNotion } = require('notase');

getDataFromNotion('YOUR API TOKEN', 'YOUR DATABASE ID')
  .then((data) => {
    // data will be all the rows in your table, an array of objects with each column as a property
  });
```

## Parsers

Default parsers are provided for the main data types (`title`, `rich_text`, `multi_select`, `number`, `url`, `files`) but can be customized if a third argument is passed.

This is in no way exhaustive and is mainly what's needed for personal use, so feel free to use your own column parsers.

## Methods

### getDataFromNotion(notionApiToken, notionDatabaseId, [parsers]) ⇒ <code>Promise.&lt;Array.&lt;T&gt;&gt;</code>

Gets all the desired database data from Notion. It will read all pages until the full table is ready and return the parsed content.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;T&gt;&gt;</code> - The parsed database results

| Param            | Type                                           | Default              | Description                            |
| ---------------- | ---------------------------------------------- | -------------------- | -------------------------------------- |
| notionApiToken   | <code>string</code>                            |                      | Notion's API token                     |
| notionDatabaseId | <code>string</code>                            |                      | Notion database ID to get results from |
| [parsers]        | <code>Record.&lt;string, function()&gt;</code> | <code>Parsers</code> | The custom parsers for your needs      |
