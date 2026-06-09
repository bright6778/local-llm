/*******************************************
 Test Name  : Issuer Authentication (IAU 040)
 Objective  : Verify the Card rejects an EXTERNAL AUTHENTICATE command with an
invalid ARPC calculated with a different ARC.

*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 040');

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
send_ExternalAuth_ARC('3030');
('6300');