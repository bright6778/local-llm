include("_PBOC_COMMON.js");

print('\n* TEST NO : DIR004');

print('\n* Power on the Card(ATR)');
reset();

response = select(pse_aid);
assertSW("9000");

response = lookup_BER_TLV(response, "6F", RETURN_VALUE);
response = lookup_BER_TLV(response, "A5", RETURN_VALUE);
response = lookup_BER_TLV(response, "88", RETURN_VALUE);

var result = '9000';
var i = 1;
var pbocADF = false;

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

				var len_4f = parseInt(lookup_BER_TLV(val, "4F", RETURN_LENGTH), 16);
				if(len_4f < parseInt('05', 16) || len_4f > parseInt('10', 16))
					error("Invalid length of tag 4F"); 
				if(lookup_BER_TLV(val, "4F", RETURN_LENGTH) != "07")
					error("Invalid length of PBOC ADF name"); 
				if(lookup_BER_TLV(val, "4F", RETURN_VALUE) == "A0000003330101")
					pbocADF = true;
			}
		}		
	}	
	i = i+1;
}

if(!pbocADF)
	error("Invalid value of PBOC ADF name"); 