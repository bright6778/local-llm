/* Unblocks the PIN, uses a 4 byte MAC

1) Power On ATR
2) Select PBOC
3) GPO 
4) Generate AC : ARQC
5) PIN Unblock
*/

include("_PBOC_COMMON.js");

print("Test Case : PBOC-UTILITY-013-PINUNBLOCK");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_PinUnblock();
assertSW('9000');