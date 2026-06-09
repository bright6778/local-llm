include("_PBOC_COMMON.js");

print('\n* TEST NO : APP009');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
select('315041592E5359532E4444463031');
assertSW("6A81");

print('\n* Select PBOC');
select('A0000003330101');
assertSW("6A81");

	