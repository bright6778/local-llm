include("_PBOC_COMMON.js");

print('\n* TEST NO : PSE090');

print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

response = send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

print('\n* Select PSE');
select(pse_aid);
assertSW("9000");