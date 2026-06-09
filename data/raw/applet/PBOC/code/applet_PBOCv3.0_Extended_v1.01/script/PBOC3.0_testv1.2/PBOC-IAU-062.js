/*******************************************
 Test Name  : Issuer Authentication (IAU 062)
 Objective  : Verify the Card rejects a second EXTERNAL AUTHENTICATE command
with an invalid ARPC.

*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 062');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000')

send_ExternalAuth_Invalid();
send_ExternalAuth_Invalid();

assertSW('6985');