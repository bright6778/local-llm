include("_PBOC_COMMON.js");

print('\n* Test Case : SLO036');

// cleaning the card
print("\n* Transaction 1");
include("pboc_CLN001.js");

// declined offline with an unsuccessful SDA
print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1_SDA_FAIL);
assertSW('9000');

// declined online without performing Issuer Authetication
print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');

// card request the transaction to go online after the terminal request a TC
print("\n* Transaction 4");
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
check_CVR("03A48900");