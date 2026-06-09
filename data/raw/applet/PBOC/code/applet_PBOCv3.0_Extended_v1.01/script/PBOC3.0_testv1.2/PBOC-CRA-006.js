include("_PBOC_COMMON.js");

print('\n* Test Case : CRA006');

//1.Cleaning the Card with EXTERNAL AUTHENTICATE
print("\n* Transaction 1");
include("pboc_CLN001.js");

//2.Online decline with a valid Issuer Script, but without performing Issuer Authentication
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
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
check_CID('00');
check_CVR('03240400');
send_AppUnblock();
assertSW('9000');
send_AppUnblock_noMAC();
assertSW('6700');

//3.Request to approve offline, the Card forces the transaction online
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
check_CID('80');
check_CVR('03A48818');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');
check_CID('40');
check_CVR('03648818');