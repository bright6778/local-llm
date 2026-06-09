include("_PBOC_COMMON.js");

print('\n* Test Case : VLC056');

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

set_AA_forVC(AA_60);
send_GEN_AC1_forVC(ARQC);
assertSW('9000');

check_CID("80");
check_CVR("03A40000");

send_ExternalAuth();
assertSW('9000');

set_AA_forVC(AA_60);
send_GEN_AC2_forVC(TC);
assertSW('9000');

check_CID("40");
check_CVR("03640000");

send_PutData_Invalid("9F54", "000000020000");
assertSW("6988");

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_AA_forVC(AA_60);
send_GEN_AC1_forVC(ARQC);
assertSW('9000');

check_CID("80");
check_CVR("03A40018");

send_ExternalAuth();
assertSW('9000');

set_AA_forVC(AA_60);
send_GEN_AC2_forVC(TC);
assertSW('9000');

check_CID("40");
check_CVR("03640018");

send_PutData("9F54", "000000010000");
assertSW("9000");
