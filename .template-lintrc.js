'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-html-comments': false,
    'no-implicit-this': { allow: ['current-time'] },
    'self-closing-void-elements': false,
    quotes: false,
  },
};
