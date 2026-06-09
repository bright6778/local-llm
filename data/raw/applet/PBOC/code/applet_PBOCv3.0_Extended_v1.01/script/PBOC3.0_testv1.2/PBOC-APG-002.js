/* Application Block */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* TEST NO : APG002');

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_GetData('9F13');
assertSW('9000');
