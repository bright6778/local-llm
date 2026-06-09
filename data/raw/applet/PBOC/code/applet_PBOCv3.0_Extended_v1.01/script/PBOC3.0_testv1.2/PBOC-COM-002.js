include("_PBOC_COMMON.js");

print('\n* Test Case : COM002');

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
send_GEN_AC_1(TC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');
assertEquals(CID, '40');
assertEquals(CVR, '03940002');

