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
    '/api/users',
    jsonResponse([
      { id: 1, name: 'Sample McFixture' },
      { id: 2, name: 'Testy Assertington' },
    ])
  );
  this.get(
    '/api/teams',
    jsonResponse([
      {
        id: 'gh',
        name: 'GitHub',
      },
    ])
  );
  this.get(
    '/api/teams/gh',
    jsonResponse({
      id: 'gh',
      name: 'GitHub',
      channels: [
        {
          id: 'prs',
          name: 'Pull Requests',
        },
      ],
    })
  );
  this.get(
    '/api/teams/gh/channels/prs',
    jsonResponse({
      id: 'prs',
      name: 'Pull Requests',
    })
  );
}
