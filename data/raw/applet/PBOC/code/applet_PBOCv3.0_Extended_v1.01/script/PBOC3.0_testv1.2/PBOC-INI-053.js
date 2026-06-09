/*******************************************
 Test Name  : Application Initialization (INI 053)
 Objective  : For each element of the AFL verify the value of the third byte
*******************************************/


include("_PBOC_COMMON.js");

print('\n* Test Case : INI053'); 

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
		var byte_2 = alf.substring(i,i+2); 
		var byte_3 = alf.substring(i+2,i+4);

		if(parseInt(byte_2,16) > parseInt(byte_3,16))
			 error("* third byte of each element (byte 3, 7, ¡¦) is equal to or greater than thensecond byte of the element.");

}

		