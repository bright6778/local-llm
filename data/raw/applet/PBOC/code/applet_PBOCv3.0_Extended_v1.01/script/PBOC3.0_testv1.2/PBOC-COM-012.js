include("_PBOC_COMMON.js");

print('\n* Test Case : COM012');

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
send_GEN_AC_1(AAC | CDA_sign_requested, TEST_CDOL1_CDA_FAIL);
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_Invalid();
assertSW('6300');
send_GEN_AC_2(TC | CDA_sign_requested, TEST_CDOL2);
assertSW('9000');

check_CID('00');

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');

check_CID('80');
check_CVR('03A48806');

