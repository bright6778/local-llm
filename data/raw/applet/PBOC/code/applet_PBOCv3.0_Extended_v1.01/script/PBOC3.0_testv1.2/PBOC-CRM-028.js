include("_PBOC_COMMON.js");

print('\n* Test Case : CRM028');

//print("* Transaction 1");
//include("pboc_CLN001.js");

//print("* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

assertEquals(LI, "07");

