include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE060');

print('\n* Power on the Card(ATR)');
reset();

print('\n* Select PSE');
response = select(pse_aid);
assertSW("9000");
response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);

var length_LP = parseInt(lookup_BER_TLV(response, "5F2D", RETURN_LENGTH), 16);
if(length_LP < parseInt('02', 16) || length_LP > parseInt('08', 16))
	error("Invalid Language Preference length range"); 	
	
response = lookup_BER_TLV(response, "5F2D", RETURN_VALUE);
// alphanumeric format .....