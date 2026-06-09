/*******************************************
 Test Name  : Application Initialization (INI 054)
 Objective  : For each element of the AFL verify the value of the second byte.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : INI054');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
response = send_GPO(TEST_PDOL_DATA);
assertSW('9000');


var a = lookup_BER_TLV(response, "80", RETURN_VALUE);
var alf = a.substring(4, (parseInt(a, 16)*2));

var cnt = 0 ;


for(i = 6 ; i < alf.length ; i = i+8)
{
		var byte_4 = alf.substring(i,i+2); 
			
				if( byte_4 != '00')
				cnt++;					
}

 if( cnt == 0)
 error("* At least one element is zero.*");

	