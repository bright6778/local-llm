include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE030');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
response = select(pse_aid);
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);

if(lookup_BER_TLV(response, "84", RETURN_LENGTH) != "0E")
	error("Invalid DF length");
if(lookup_BER_TLV(response, "84", RETURN_VALUE) != "315041592E5359532E4444463031")
	error("Invalid DF name");
	