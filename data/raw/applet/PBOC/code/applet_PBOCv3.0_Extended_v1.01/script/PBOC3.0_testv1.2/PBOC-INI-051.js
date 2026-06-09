/*******************************************
 Test Name  : Application Initialization (INI 051)
 Objective  : For each element of the AFL verify the value of the first byte.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : INI021');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
response = send_GPO(TEST_PDOL_DATA);
assertSW('9000');


var a = lookup_BER_TLV(response, "80", RETURN_VALUE);
var alf = a.substring(4, (parseInt(a, 16)*2));



for(i = 0 ; i < alf.length ; i = i+8)
{
		var first_a = parseInt(alf.substring(i,i+2),16); 
		
		if( (first_a & BIT_MASK_3) == BIT_MASK_3)
			error("* Byte 3 Bit 3 Issuer Authentication not performed after online authorization");
		if( (first_a & BIT_MASK_2) == BIT_MASK_2)
			error("* Byte 3 Bit 2 Application blocked by card because PIN Try Limit exceeded");
		if( (first_a & BIT_MASK_1) == BIT_MASK_1)
			error("* Byte 3 Bit 1 Offline static data authentication failed on last transaction and transaction declined offline");
		
 }

	