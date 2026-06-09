include("_PBOC_COMMON.js");

print('\n* Test Case : CRM511');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
var firstCVR = CVR;

send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
var secondCVR = CVR;

assertEquals(CVR.substring(0,2), "03");
assertEquals(CVR.substring(2,3), "6");
assertEquals(firstCVR.substring(4,5), secondCVR.substring(4,5));

