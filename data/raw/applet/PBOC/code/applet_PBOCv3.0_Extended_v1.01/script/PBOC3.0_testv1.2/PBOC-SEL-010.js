include("_PBOC_COMMON.js");

print('\n* TEST NO : SEL001');
include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW("9000");

	