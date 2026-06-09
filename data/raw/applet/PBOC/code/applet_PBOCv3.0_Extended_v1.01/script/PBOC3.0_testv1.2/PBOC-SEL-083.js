include("_PBOC_COMMON.js");

print('\n* TEST NO : SEL083');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();

print('\n* *****::::::::::::::::::*');
send('00A404' + '00' + '07' + 'A0000003330101' + '00');
send('00A404' + '02' + '07' + 'A0000003330101' + '00');
send('00A404' + '02' + '07' + 'A0000003330101' + '00');
send('00A404' + '00' + '08' + 'A000000333010101' + '00');

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

check_CID('40');
check_CVR('03640000');