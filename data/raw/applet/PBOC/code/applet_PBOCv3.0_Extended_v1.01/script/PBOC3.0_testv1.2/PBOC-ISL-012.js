include("_PBOC_COMMON.js");

print('\n* Test Case : ISL012');

// cleaning the card
print("\n* Transaction 1");
include("pboc_CLN001.js");

// approved online, issuer-to-card script
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
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
send_PutData_noMAC('9F58', '07'); // LCOL:9F58
assertSW('6700');

// approved offline
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

check_CID('40');
check_CVR('03940008');