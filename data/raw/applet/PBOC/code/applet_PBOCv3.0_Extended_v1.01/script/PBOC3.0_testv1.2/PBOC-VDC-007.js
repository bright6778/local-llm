include("_PBOC_COMMON.js");

print('\n* Test Case : VDC007');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline_AA50.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline_AA50.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline_AA50.js");

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
set_AA_forVC(AA_50);
send_GEN_AC1_forVC(TC);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
set_AA_forVC(AA_50);
send_GEN_AC2_forVC(TC);
assertSW('9000');

print("\n* Transaction 6");
include("pboc_ApprovedOffline_AA50.js");

check_CID("40");
check_CVR("03940000");
