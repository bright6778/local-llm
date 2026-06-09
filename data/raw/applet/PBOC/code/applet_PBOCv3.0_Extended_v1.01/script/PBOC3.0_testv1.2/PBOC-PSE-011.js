include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE011');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
select(pse_aid);
assertSW("9000");	