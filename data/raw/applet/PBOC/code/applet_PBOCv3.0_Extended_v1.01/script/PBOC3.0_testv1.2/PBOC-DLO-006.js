include("_PBOC_COMMON.js");

print('\n* Test Case : DLO006');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_InternalAuth();
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');

print("\n* Transaction 3");
include ("pboc_ApprovedOffline_forDDA.js");
check_CID("40");
check_CVR("03940002");