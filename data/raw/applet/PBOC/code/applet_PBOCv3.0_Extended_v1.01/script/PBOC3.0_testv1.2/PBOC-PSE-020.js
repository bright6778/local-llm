include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE020');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
response = select(pse_aid);
assertSW("9000");
length = lookup_BER_TLV(response, "6F", RETURN_LENGTH);
if(length > 252)
	error("Invalid FCI template");
	