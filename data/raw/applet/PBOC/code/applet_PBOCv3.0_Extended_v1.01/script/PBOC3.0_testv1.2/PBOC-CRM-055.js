include("_PBOC_COMMON.js");

print('\n* Test Case : CRM055');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
var firstATC = send_GEN_AC_1(ARQC, TEST_CDOL1).substring(6,10);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
var secondATC = send_GEN_AC_2(TC, TEST_CDOL2).substring(6,10);
assertSW('9000');

assertEquals(firstATC, secondATC);
