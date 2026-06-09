include("_PBOC_COMMON.js");

print('\n* Test Case : ONA014');

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
send_ExternalAuth_ARC_InvalidARPC('3030');
send_GEN_AC_2(TC, '30300000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) != BIT_MASK_7)
	error("Byte 1 Bit 7 = not 1");
check_CVR('036C0000');


print("\n* Transaction 3");
include("pboc_CLN001.js");

print("\n* Transaction 4");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_ARC_InvalidARPC('3031');
send_GEN_AC_2(TC, '30310000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) != BIT_MASK_7)
	error("Byte 1 Bit 7 = not 1");
check_CVR('036C0000');


print("\n* Transaction 5");
include("pboc_CLN001.js");

print("\n* Transaction 6");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_ARC_InvalidARPC('3032');
send_GEN_AC_2(TC, '30320000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) != BIT_MASK_7)
	error("Byte 1 Bit 7 = not 1");
check_CVR('036C0000');


print("\n* Transaction 7");
include("pboc_CLN001.js");

print("\n* Transaction 8");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_ARC_InvalidARPC('3130');
send_GEN_AC_2(TC, '31300000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) != BIT_MASK_7)
	error("Byte 1 Bit 7 = not 1");
check_CVR('036C0000');


print("\n* Transaction 9");
include("pboc_CLN001.js");

print("\n* Transaction 10");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_ARC_InvalidARPC('3131');
send_GEN_AC_2(TC, '31310000000010000000000000000156000000000001560001251647210011223344');
assertSW('9000');

var byte1 = parseInt(CID.substring(0,2), 16);
if((byte1 & BIT_MASK_8) == BIT_MASK_8)
	error("Byte 1 Bit 8 = not 0");
if((byte1 & BIT_MASK_7) != BIT_MASK_7)
	error("Byte 1 Bit 7 = not 1");
check_CVR('036C0000');
