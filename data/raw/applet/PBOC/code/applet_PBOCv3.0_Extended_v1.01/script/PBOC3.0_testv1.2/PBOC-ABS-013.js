/* Application Block */

include("_PBOC_COMMON.js");

print("ABS013");

print("\n* Transaction 1");
include("pboc_CLN001.js");

print('\n* Transaction 2');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
assertSW('63C2');
send_Verify('80', TEST_PLAIN_PIN_INVALID);
assertSW('63C1');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
assertEquals(CID, '40');
assertEquals(CVR, '03640000');

print("\n* Transaction 3");
include("pboc_CLN001.js");
assertEquals(CVR, '03640000');