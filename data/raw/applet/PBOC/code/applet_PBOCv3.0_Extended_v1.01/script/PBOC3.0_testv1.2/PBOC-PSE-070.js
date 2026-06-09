include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE070');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
response = select(pse_aid);
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);

if(lookup_BER_TLV(response, "9F11", RETURN_LENGTH) != "01")
	error("Invalid Issuer Code Table Index length");
	
var value = parseInt(lookup_BER_TLV(response, "9F11", RETURN_VALUE), 16);
if(value < parseInt('01', 16) || value > parseInt('0A', 16))
	error("Invalid Issuer Code Table Index value range"); 