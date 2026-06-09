include("_PBOC_COMMON.js");

print('\n* Test Case : AUS004');

print("\n* Transaction 1");
include("pboc_AppBlk.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("6283");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW("9000");
send_ExternalAuth_Invalid();
assertSW("6300");
send_AppUnblock();
assertSW("6985");

print("\n* Transaction 3");
reset();
send('00 A4 04 00 07 A0 00 00 03 33 01 02 00'); // select invalide PBOC
if (getSW() != '6A82')
	error('* AUS004 Error!!');