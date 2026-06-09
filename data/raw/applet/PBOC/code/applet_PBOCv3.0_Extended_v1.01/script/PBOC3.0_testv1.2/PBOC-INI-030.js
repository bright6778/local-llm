/*******************************************
 Test Name  : Application Initialization (INI 030)
 Objective  : Verify the AIP and AFL in response a successful GET PROCESSING
              OPTIONS command.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : INI030');

reset();
include("pboc_CLN001.js");
reset();
select_PBOC();
assertSW('9000');
response = send_GPO(TEST_PDOL_DATA);
assertSW('9000');

var a = lookup_BER_TLV(response, "80", RETURN_VALUE);
if ( a.substring(0,4) != "5C00")
	error("AIP value  Error");
	

var b = lookup_BER_TLV(response, "80", RETURN_LENGTH);
print('\n* Test Case : ' + b);
print('\n* Test Case : ' + parseInt(b, 16));

var c = a.substring(4, (parseInt(b, 16)*2));
if ( 4 > c.length)
error("AFL value  Error");

print('\n* Test Case : ' + c);
print('\n* Test Case : ' + c.length);


