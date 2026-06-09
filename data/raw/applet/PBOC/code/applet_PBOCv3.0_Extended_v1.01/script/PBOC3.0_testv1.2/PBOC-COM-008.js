include("_PBOC_COMMON.js");

print('\n* Test Case : COM008');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2_Z3_CDA_FAIL);
assertSW("9000");
check_CID("00");
check_CVR("03250002");

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(TC | CDA_sign_requested, TEST_CDOL1);
assertSW("9000");
check_CID("80");

send_ExternalAuth();
assertSW("9000");
send_GEN_AC_2(TC | CDA_sign_requested, TEST_CDOL2);
assertSW("9000");
check_CID("40");
check_CVR("03648006");


