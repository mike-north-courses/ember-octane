import { dateToString } from 'shlack/utils/date';
import { module, test } from 'qunit';

module('Unit | Utility | date', function () {
  // Replace this with your real tests.
  test('string inputs', function (assert) {
    assert.equal(dateToString('04/05/1983 1:31 AM'), 'Apr 5, 1983 01:31.00 AM', 'MM/DD/YYYY');
    assert.equal(dateToString('4/5/1983'), 'Apr 5, 1983 00:00.00 AM', 'M/D/YYYY');
    assert.equal(
      dateToString('26 June 2010 13:14'),
      'Jun 26, 2010 01:14.00 PM',
      '26 June 2010 13:14'
    );
  });

  test('empty and invalid inputs', function (assert) {
    // @ts-ignore
    assert.equal(dateToString(), null);
    // @ts-ignore
    assert.equal(dateToString(null), null);
    // @ts-ignore
    assert.equal(dateToString([]), null);
    // @ts-ignore
    assert.equal(dateToString({}), null);
  });
});
