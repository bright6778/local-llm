/*******************************************
 Test Name  : Read Other Application Data (APD 001)
 Objective  : Verify the status word returned in all responses on READ RECORD
commands following GET PROCESSING OPTIONS
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : APD001');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_ReadRecord
assertSW('9000');


