/* Application Block */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

include("PBOC-UTILITY-001-APPUNBLOCK.js");

var response;

print('\n* TEST NO : APG014');

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

select_PBOC();
assertSW('6283');

response = send_GetData('9F7F');
assertSW('9000');

include("PBOC-UTILITY-001-APPUNBLOCK.js");