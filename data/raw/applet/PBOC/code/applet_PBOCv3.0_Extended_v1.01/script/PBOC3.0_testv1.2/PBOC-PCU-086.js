include("_PBOC_COMMON.js");

print('\n* Test Case : PCU086');

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
assertSW('9000');
assertEquals(CID, '40');
assertEquals(CVR, '03640000');

send_PinChange(null, '12345');
assertSW('9000');


print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN_forPCU);
assertSW('9000');

send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
assertEquals(CID, '40');
assertEquals(CVR, '03640010');

send_PinChange(null, '1234');
assertSW('9000');

print("\n* Transaction 4");
include("pboc_CLN001.js");
