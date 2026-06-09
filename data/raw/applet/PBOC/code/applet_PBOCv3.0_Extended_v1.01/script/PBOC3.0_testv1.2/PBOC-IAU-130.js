/*******************************************
 Test Name  : Issuer Authentication (IAU 130)
 Objective  : Verify the Card rejects an EXTERNAL AUTHENTICATE command when
the VSDC application was not initialized.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : IAU 130');

print("\n* Transaction 1");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('6985');
AC = '';
send_ExternalAuth();
assertSW('9000');
