include("_PBOC_COMMON.js");

print('\n* Test Case : PCU066');  
// VISA-PCU062는 8byte mac 지원환경에서 8byte를 오버한 mac을 보냈을 시 에러 체크하는 테스트임.
// PBOC 에선 8byte MAC을 지원안하므로, 4byte MAC 을 오버했을 시 에러를 체크하는 테스트를 하겠음.

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

print('\n* pin change p2=02');
send("842400021A" + "7896321475369874122558871559955124" + "112233445566778899");
assertSW('6700');