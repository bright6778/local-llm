include("_PBOC_COMMON.js");

print('\n* TEST NO : APG016');

print('\n* Power on the Card(ATR)');
reset();

send_GetData('9F7F');
assertSW('9000');