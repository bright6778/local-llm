include("_PBOC_COMMON.js");

print('\n* TEST NO : DIR005');

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

				var len_50 = parseInt(lookup_BER_TLV(val, "50", RETURN_LENGTH), 16);
				if(len_50 > parseInt('10', 16))
					error("Invalid length of tag 50"); 
				// alphanumeric fomat?
				if(lookup_BER_TLV(val, "50", RETURN_VALUE) != "50424F4320437265646974")
					error("Invalid value of PBOC ADF name"); 
			}
		}		
	}	
	i = i+1;
}