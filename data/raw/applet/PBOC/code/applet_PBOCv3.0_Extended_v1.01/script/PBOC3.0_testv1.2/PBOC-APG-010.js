/* Application Block */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

var response;

print('\n* TEST NO : APG010');

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

response = send_GetData('9F57');
assertSW('9000');
assertEquals(response.substring(0,6), '9F5702');

