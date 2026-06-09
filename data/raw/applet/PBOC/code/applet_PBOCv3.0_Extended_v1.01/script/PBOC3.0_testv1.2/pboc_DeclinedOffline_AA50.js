include("_PBOC_COMMON.js");

print("Decline offline, Amount Authorized = 50");

reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");

set_AA_forVC(AA_50);
send_GEN_AC1_forVC(AAC);
assertSW("9000");

