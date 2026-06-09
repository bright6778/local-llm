include("_PBOC_COMMON.js");

print('\n* TEST NO : APP005');

print('\n* Power on the Card(ATR)');
reset();

response = select_PBOC();
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);

if(lookup_BER_TLV(response, "87", RETURN_LENGTH) != "01")
	error("Invalid length of Application Priority Indicator");
if(lookup_BER_TLV(response, "87", RETURN_VALUE) != "01")
	error("Invalid value of Application Priority Indicator");
	
