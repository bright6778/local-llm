include("_PBOC_COMMON.js");

print('\n* Test Case : PIN001');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

assertEquals(CID, "40");

print("\n-- CVR Interpretation : " + CVR);
var CVR_BYTE2 = parseInt(CVR.substring(2,4), 16);
var CVR_BYTE3 = parseInt(CVR.substring(4,6), 16);

if( (CVR_BYTE2 & BIT_MASK_3) == BIT_MASK_3)
	error("Byte 2 Bit 3 = not 0"); 
if( (CVR_BYTE2 & BIT_MASK_2) == BIT_MASK_2)
	error("Byte 2 Bit 2 = not 0"); 
if( (CVR_BYTE3 & BIT_MASK_7) == BIT_MASK_7)
	error("Byte 3 Bit 7 = not 0");