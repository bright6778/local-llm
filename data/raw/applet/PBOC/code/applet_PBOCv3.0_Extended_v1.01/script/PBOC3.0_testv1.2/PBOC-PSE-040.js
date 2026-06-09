include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE040');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
response = select(pse_aid);
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);

if(response == "")
	error("FCI Proprietary Template doesn't exist");