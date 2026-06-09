include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE010');

print('\n* Power on the Card(ATR)');
reset();
response = select(pse_aid);
assertSW("9000");


	