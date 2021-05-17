/**
 *
 * @param {any} body
 * @returns {ResponseHandler}
 */
function jsonResponse(body) {
  return function () {
    return [200, {}, JSON.stringify(body)];
  };
}

/**
 * @this {Pretender}
 */
function setupServer() { // eslint-disable-line
  this.get(
    '/api/teams/gh/channels/prs',
    jsonResponse({
      id: 'prs',
      teamId: 'gh',
      name: 'Pull Requests',
    })
  );
  this.get(
    '/api/teams/gh/channels/prs/messages',
    jsonResponse([
      {
        id: 1,
        user: {
          name: 'Testy Testerson',
        },
        body: 'Hello Tests',
      },
    ])
  );
}
