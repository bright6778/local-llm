/* Sets the LCOL = 3, and cleans the Card

1) Power On ATR
2) Select PBOC
3) GPO 
4) Verify
5) Generate AC : ARQC
6) External Auth with valid ARPC
7) Generate AC : TC
8) Put Data : the Lower Consecutive Offline Limit
*/

include("_PBOC_COMMON.js");

print("Test Case : PBOC-UTILITY-010-CLNLCOL");

reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW("9000");
send_ExternalAuth();
assertSW("9000");
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");
send_PutData('9F58','03'); // tag, value
assertSW("9000");