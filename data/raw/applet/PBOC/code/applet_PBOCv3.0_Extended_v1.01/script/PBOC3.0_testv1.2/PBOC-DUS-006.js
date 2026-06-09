include("_PBOC_COMMON.js");

print('\n* Test Case : DUS006');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN); //pin 검증을 위해 p2 값 80으로 설정 
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_Invalid();
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");
send_PutData("9F58", "02");
assertSW('6985');

print("\n* Transaction 3");
include("pboc_CLN001.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 5");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 6");
include("pboc_ApprovedOffline.js");
check_CID("40");
if(CVR.substring(2,3) != "9" || CVR.substring(4,6) & 0x20 != 0x00)
	error("* Check CVR ... FAIL");
else
	print("* Check CVR ... PASS");


print("\n* Transaction 7");
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
if(CVR.substring(2,3) != "A" || CVR.substring(4,6) & 0x20 != 0x20)
	error("* Check CVR ... FAIL");
else
	print("* Check CVR ... PASS");
