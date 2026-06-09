include("_PBOC_COMMON.js");

print('\n* TEST NO : DIR006');

print('\n* Power on the Card(ATR)');
reset();

response = select(pse_aid);
assertSW("9000");

response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);
response = lookup_BER_TLV(response, "88", RETURN_VALUE);

var result = '9000';
var i = 1;

while(result == '9000') {
	response = send_ReadRecord(parseInt(response, 16), parseInt(i,16));
	result = getSW();
	if(result == '9000') {
		response = lookup_BER_TLV(response, "70", RETURN_VALUE);
		for ( j = 0; j < response.length; j) {
			if(response.substring(j, j+2) == "61") {
				var len = response.substring(j+2, j+4);
				var val = response.substring(j+4, j+4+(parseInt(len, 16)*2));		
				j = j +	4 + (parseInt(len, 16)*2);
				
				var val_9f12 = lookup_BER_TLV(val, "9F12", RETURN_VALUE);
				var len_9f12 = parseInt(lookup_BER_TLV(val, "9F12", RETURN_LENGTH), 16);

				if(val_9f12 != '') {
					if(len_9f12 > parseInt('10', 16))
						error("Invalid length of tag 9F12"); 
					// alphanumeric fomat?
					if(val_9f12 != perso_appPreferredName)
						error("Invalid value of PBOC ADF name"); 
				}
			}
		}		
	}	
	i = i+1;
}
