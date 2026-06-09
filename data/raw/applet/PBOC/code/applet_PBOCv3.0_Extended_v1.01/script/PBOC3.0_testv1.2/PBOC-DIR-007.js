include("_PBOC_COMMON.js");

print('\n* TEST NO : DIR007');

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

				var val_87 = lookup_BER_TLV(val, "87", RETURN_VALUE);
				var len_87 = lookup_BER_TLV(val, "87", RETURN_LENGTH);

				if(val_87 != '') {
					if(len_87 != "01")
						error("Invalid length of tag 87"); 

					var val_87_BYTE1 = parseInt(val_87.substring(0,2), 16);
					if( (val_87_BYTE1 & BIT_MASK_7) == BIT_MASK_7)
						error("Byte 1 Bit 7 = not 0");
					if( (val_87_BYTE1 & BIT_MASK_6) == BIT_MASK_6)
						error("Byte 1 Bit 6 = not 0");
					if( (val_87_BYTE1 & BIT_MASK_5) == BIT_MASK_5)
						error("Byte 1 Bit 5 = not 0");	
					
					if(val_87 != "01")
						error("Invalid value of PBOC Application Priority Indicator"); 		
				}
			}
		}		
	}	
	i = i+1;
}