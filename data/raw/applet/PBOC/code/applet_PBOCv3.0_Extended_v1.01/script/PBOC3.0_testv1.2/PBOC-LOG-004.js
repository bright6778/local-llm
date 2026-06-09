include("_PBOC_COMMON.js");

print('\n* Test Case : LOG004');

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
check_CID('80');
check_CVR('03A40000');

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
check_CID('00');
check_CVR('03240000');

send_AppBlock();
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('6283');
send_GetData('9F4F'); //Log Format
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
for(i = 1; i <= parseInt(Log_RecNum, 16); i++) {
	send_ReadRecord(parseInt(Log_SFI, 16), parseInt(i,16));
	//assertSW('9000');
}
	
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
check_CID('00');
check_CVR('03840010');

send_ExternalAuth();
assertSW('9000');
send_AppUnblock();
assertSW('9000');
