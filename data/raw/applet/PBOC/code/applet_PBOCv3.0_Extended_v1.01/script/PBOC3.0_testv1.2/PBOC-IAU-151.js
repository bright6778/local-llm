/*******************************************
 Test Name  : Issuer Authentication (IAU 151)
 Objective  : Verify the Card rejects an EXTERNAL AUTHENTICATE command
performed after the second GENERATE AC command for an online approved
transaction.

*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 151');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000')
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000')
send_ExternalAuth();
assertSW('6985');