/* Standard Offline DDA Approval

1) Power On ATR
2) Select PBOC
3) GPO 
4) Internal Authenticate
5) Generate AC : TC
*/

include("_PBOC_COMMON.js");

print("Test Case : PBOC-UTILITY-012-DDATEST");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_InternalAuth();
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');