var pse_aid = '315041592E5359532E4444463031';  // 

include("_PBOC_COMMON.js");
include("PBOC-UTILITY-001-APPUNBLOCK.js");

print('\n* TEST NO : APP008');

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW("9000");
send_ExternalAuth();
assertSW("9000");
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW("9000");
send_AppBlock();
assertSW("9000");

reset();

print('\n* Select PSE');
select(pse_aid);
assertSW("9000");
select_PBOC();
assertSW("6283");

include("PBOC-UTILITY-001-APPUNBLOCK.js");
