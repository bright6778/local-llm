/* Unblocks a blocked Application

1) Power On ATR
2) Select PBOC
3) GPO 
4) Verify
5) Generate AC : ARQC
6) External Auth with valid ARPC
7) App Unblock
*/

include("_PBOC_COMMON.js");

print("Test Case : PBOC-UTILITY-001-APPUNBLOCK");

reset();

select_PBOC();
//assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_AppUnblock();
assertSW('9000');