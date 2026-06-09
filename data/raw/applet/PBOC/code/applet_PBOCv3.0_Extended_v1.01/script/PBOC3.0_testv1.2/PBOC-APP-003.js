include("_PBOC_COMMON.js");

print('\n* TEST NO : APP003');

print('\n* Power on the Card(ATR)');
reset();

response = select_PBOC();
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);

if(lookup_BER_TLV(response, "84", RETURN_LENGTH) != "07")
	error("Invalid DF length");
if(lookup_BER_TLV(response, "84", RETURN_VALUE) != "A0000003330101")
	error("Invalid DF name");

