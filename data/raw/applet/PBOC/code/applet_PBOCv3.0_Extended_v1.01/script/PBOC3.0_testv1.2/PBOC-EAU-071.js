/*******************************************
 Test Name  : EXTERNAL AUTHENTICATE Command (EAU 071)
 Objective  : An EXTERNAL AUTHENTICATE command where the data field less than 
 '0A' is unsuccessful.
*******************************************/

include("_PBOC_COMMON.js");

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send("008200000711223344556677");
assertSW('6700');