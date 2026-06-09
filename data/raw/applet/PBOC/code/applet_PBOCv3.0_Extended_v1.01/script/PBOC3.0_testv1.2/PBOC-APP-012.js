include("_PBOC_COMMON.js");

print('\n* TEST NO : APP012');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PBOC');
select('A0000003330101');
assertSW("6A81");
