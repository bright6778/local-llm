include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE110');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
select('315041592E5359532E4444463031');
assertSW("6A81");