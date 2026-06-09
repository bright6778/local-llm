include("_PBOC_COMMON.js");

print('\n* Test Case : VDC038');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_50);
send_GEN_AC1_forVC(ARQC);
assertSW("9000");

set_AA_forVC(AA_50);
set_ARC_forVC(ARC_Y3);
send_GEN_AC2_forVC(TC);
assertSW("9000");

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_50);
send_GEN_AC1_forVC(ARQC);
assertSW("9000");

set_AA_forVC(AA_50);
set_ARC_forVC(ARC_Y3);
send_GEN_AC2_forVC(TC);
assertSW("9000");

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_50);
send_GEN_AC1_forVC(ARQC);
assertSW("9000");

set_AA_forVC(AA_50);
set_ARC_forVC(ARC_Y3);
send_GEN_AC2_forVC(TC);
assertSW("9000");

print("\n* Transaction 5");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_50);
send_GEN_AC1_forVC(TC);
assertSW("9000");

check_CID("80");
check_CVR("03A4A000");
