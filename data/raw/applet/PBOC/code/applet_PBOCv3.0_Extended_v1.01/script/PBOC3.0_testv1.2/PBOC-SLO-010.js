include("_PBOC_COMMON.js");

print('\n* Test Case : SLO010');

// cleaning the card
print("\n* Transaction 1");
include("pboc_CLN001.js");

// 1) go online but the terminal could not go online
// 2) declined offline without performing SDA
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
send_GEN_AC_2(AAC, TEST_CDOL2_Z3);
assertSW('9000');

// go offline but the card request to go online
print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

check_CID("80");
check_CVR("03A48000");