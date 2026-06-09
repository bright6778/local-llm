/* Cleaning Card with External Authenticate(CLN001)

1) Power On ATR
2) Select PBOC
3) GPO 
4) Verify
5) Generate AC : ARQC
6) External Auth with valid ARPC
7) Generate AC : TC
*/
include("_PBOC_COMMON.js");

print('\n* Test Case : CLN001');
Terminal_Transaction_Qualifiers = '00000000';
reset();
select_PBOC();
assertSW('9000');//15601 -> 15600
send_GPO("831F015600000000000000015642616E6B436172645465737443656E7465722020"); //PBOC-PSO-042 Image related PDOL data
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');