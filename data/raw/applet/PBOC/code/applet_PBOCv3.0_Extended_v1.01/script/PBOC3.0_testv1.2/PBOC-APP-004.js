include("_PBOC_COMMON.js");

print('\n* TEST NO : APP004');

print('\n* Power on the Card(ATR)');
reset();

response = select_PBOC();
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);

if(response == "")
	error("FCI Proprietary Template doesn't exist");
	