include("_PBOC_COMMON.js");

print('\n* Test Case : PCU082');  

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');

send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');

send_ExternalAuth();
assertSW('9000');

send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

print('\n* pin unblock');
send_PinUnblock();
assertSW('9000');