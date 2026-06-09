include("_PBOC_COMMON.js");

print('\n* Test Case : VLI053');

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

set_TCC_forVC("0826");
send_GEN_AC1_forVC(TC);
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_TCC_forVC("0826");
send_GEN_AC1_forVC(TC);
assertSW('9000');

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_TCC_forVC("0826");
send_GEN_AC1_forVC(TC);
assertSW('9000');

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_TCC_forVC("0826");
send_GEN_AC1_forVC(TC);
assertSW('9000');

print("\n* Transaction 6");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_TCC_forVC("0826");
send_GEN_AC1_forVC(TC);
assertSW('9000');

print("\n* Transaction 7");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

set_TCC_forVC("0826");
send_GEN_AC1_forVC(AAC);
assertSW('9000');

check_CID("00");
check_CVR("03842000");
