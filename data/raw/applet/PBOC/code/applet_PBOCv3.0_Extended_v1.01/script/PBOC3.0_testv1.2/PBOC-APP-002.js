include("_PBOC_COMMON.js");

print('\n* TEST NO : APP002');

print('\n* Power on the Card(ATR)');
reset();

response = select_PBOC();
assertSW("9000");
length = lookup_BER_TLV(response, "6F", RETURN_LENGTH);
if(length > 252)
	error("Invalid FCI template");
	
