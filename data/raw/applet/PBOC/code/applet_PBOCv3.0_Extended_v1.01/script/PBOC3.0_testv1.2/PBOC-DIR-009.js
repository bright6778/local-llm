include("_PBOC_COMMON.js");

print('\n* TEST NO : DIR009');

print('\n* Power on the Card(ATR)');
reset();

response = select('315041592E5359532E4444463031');
assertSW("6A81");

response = send_ReadRecord(parseInt('01', 16), parseInt('01',16));
result = getSW();
if(result == '9000') {
	error("Expect SW is 6985 or 6A81");			
}	
