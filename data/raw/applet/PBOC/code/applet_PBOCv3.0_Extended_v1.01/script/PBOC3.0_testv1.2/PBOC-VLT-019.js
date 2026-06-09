include("_PBOC_COMMON.js");

print('\n* Test Case : VLT019');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

print("\n* Transaction 6");
include("pboc_DeclinedOffline.js");

check_CID("00");
check_CVR("03840000");
