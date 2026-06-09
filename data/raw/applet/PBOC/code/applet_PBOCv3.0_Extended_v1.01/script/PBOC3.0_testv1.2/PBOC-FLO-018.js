include("_PBOC_COMMON.js");

print('\n* Test Case : FLO018');

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
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

print("\n* Transaction 3");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) == BIT_MASK_7)
	error("Byte 1 Bit 7 = not 0");
	
check_CVR('03848800');
