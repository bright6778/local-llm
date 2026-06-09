/*******************************************
 Test Name  : READ RECORD Command (RED 011)
 Objective  : Verify the Card returns a status word of '90 00' in response to successful
READ RECORD command
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");  
include("pboc_CLN001.js");

print('\n* Test Case : RED 011');

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send('00B2010C00');
assertSW('9000');
