include("_PBOC_COMMON.js");

print('\n* TEST NO : SEL081');

print('\n* Power on the Card(ATR)');
reset();

select('A0000003333010'); 
assertSW("6A82");

	