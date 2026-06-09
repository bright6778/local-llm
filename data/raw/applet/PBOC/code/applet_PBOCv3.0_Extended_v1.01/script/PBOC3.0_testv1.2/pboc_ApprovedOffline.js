/*
1) Power On ATR
2) Select PBOC
3) GPO 
4) Verify
5) Generate AC : TC

*/
include("_PBOC_COMMON.js");

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

