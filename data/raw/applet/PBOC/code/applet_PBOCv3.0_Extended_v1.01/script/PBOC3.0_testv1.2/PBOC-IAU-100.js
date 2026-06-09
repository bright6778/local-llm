/*******************************************
 Test Name  : Issuer Authentication (IAU 100)
 Objective  : Verify the Card rejects a second EXTERNAL AUTHENTICATE command
with an invalid ARPC.

*******************************************/

include("_PBOC_COMMON.js");
include("pboc_AppBlk.js");

print('\n* Test Case : IAU 100');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
//select_PBOC();
send('00A404000710000003330101');

send_GPO(TEST_PDOL_DATA);
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(ARQC, TEST_CDOL1);
send_ExternalAuth();
include("PBOC-UTILITY-001-APPUNBLOCK.js");
assertSW('9000');