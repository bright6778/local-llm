include("_PBOC_COMMON.js");
var pse_aid = '315041592E5359532E4444463031';

print('\n* TEST NO : PSE012');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
select(pse_aid);
assertSW("6A82");
