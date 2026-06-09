/* Application Block */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

var response;

print('\n* TEST NO : APG012');

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

response = send_GetData('9F58');
assertSW('9000');
assertEquals(response.substring(0,8), '9F580103');

