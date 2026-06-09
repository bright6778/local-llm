include("_PBOC_COMMON.js");

print('\n* Test Case : OFA008');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
send_Verify('80', TEST_PLAIN_PIN_INVALID);
send_Verify('80', TEST_PLAIN_PIN_INVALID);
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');

check_CID('00');
check_CVR('03864000');