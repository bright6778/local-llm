/*******************************************
 Test Name  : Application Initialization (INI)
 Objective  : Verify the Response Message Template in response to a successful GET
              PROCESSING OPTIONS command.
*******************************************/
 
include("_PBOC_COMMON.js");

print('\n* Test Case : INI021');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
response = send_GPO(TEST_PDOL_DATA);
assertSW('9000');

var a = parseInt(lookup_BER_TLV(response, "80", RETURN_LENGTH), 16);
if(a < parseInt('06', 16))
	error("Invalid 80 template length Error");
	
