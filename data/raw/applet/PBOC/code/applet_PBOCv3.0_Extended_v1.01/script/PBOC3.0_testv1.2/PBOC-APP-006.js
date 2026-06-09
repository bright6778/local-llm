include("_PBOC_COMMON.js");

print('\n* TEST NO : APP006');

print('\n* Power on the Card(ATR)');
reset();

response = select_PBOC();
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);


if(lookup_BER_TLV(response, "9F38", RETURN_LENGTH) != "06")
	error("Invalid length of PDOL");
if(lookup_BER_TLV(response, "9F38", RETURN_VALUE) != "9F33039F4E14")
	error("Invalid value of PDOL");
	
