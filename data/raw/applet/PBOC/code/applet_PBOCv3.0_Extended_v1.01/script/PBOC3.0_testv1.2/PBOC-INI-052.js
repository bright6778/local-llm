/*******************************************
 Test Name  : Application Initialization (INI 052)
 Objective  : For each element of the AFL verify the value of the second byte.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : INI052');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
response = send_GPO(TEST_PDOL_DATA);
assertSW('9000');


var a = lookup_BER_TLV(response, "80", RETURN_VALUE);
var alf = a.substring(4, (parseInt(a, 16)*2));

for(i = 2 ; i < alf.length ; i = i+8)
{
		var first_a = alf.substring(i,i+2); 
		
				if( first_a == '00')
			error("* The first byte of each element (byte 1, 5, ¡¦) = xxxxx000");
		}