include("_PBOC_COMMON.js");
print('\n* Test Case : DUS010');

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
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");

check_CVR("03640000");

send_PutData("9F58", "02");
assertSW('9000');
send_PutData_Invalid("9F58", "01");
assertSW('6988');

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

check_CID("40");
check_CVR("03940028");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

check_CID("40");
check_CVR("03940028");

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
assertSW("9000");

check_CID("40");
check_CVR("03642028");

send_PutData("9F58", "03");
assertSW('9000');


