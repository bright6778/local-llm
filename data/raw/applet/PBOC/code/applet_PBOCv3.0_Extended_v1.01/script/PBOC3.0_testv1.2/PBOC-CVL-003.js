include("_PBOC_COMMON.js");

print("CVL003");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_DeclinedOffline_AA25.js");

print("\n* Transaction 3");
include("pboc_DeclinedOffline_AA25.js");

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_25);
send_GEN_AC1_forVC(ARQC);
assertSW("9000");

set_AA_forVC(AA_25);
set_ARC_forVC(ARC_Y3);
send_GEN_AC2_forVC(TC);
assertSW("9000");

assertEquals(CID, "40");
assertEquals(CVR, "03650000");
