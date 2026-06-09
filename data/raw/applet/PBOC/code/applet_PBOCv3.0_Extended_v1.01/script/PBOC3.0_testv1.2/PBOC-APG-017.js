/* Application Block */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

var response;

print('\n* TEST NO : APG017');

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

response = send_GetData('9F7F');
assertSW('9000');
