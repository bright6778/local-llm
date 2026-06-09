/*******************************************
 Test Name  : Card resets CTCI when online transaction is approved
 Card Image : PBOC-PSO-035-(for NMCO1)
 Reference  : VCPS 2CO.011.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-NMCO-004-2CO.011.00.00');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");


///////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : CVM Required by card for non-matching currency - Offline Transaction")

Transaction_Currency_Code = Transaction_Currency_Code_Diff;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);

doTransaction(5, "0701010390000001");

///////////////////////// Case 02 //////////////////////////// 
print("\n* Case 02 : Contact VSDC online approved transaction to reset Consecutive Transaction Counter International")
init(CT_PORT, CT_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();
include("qPBOC-CLN-001.js");
send_PutData('9F53', '03');

///////////////////////// Case 03 //////////////////////////// 
print("\n* Case 03 : CVM Required by card for non-matching currency - Offline Transaction")
init(CL_PORT, CL_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();

select_PBOC();
assertSW("9000");

Transaction_Currency_Code = Transaction_Currency_Code_Diff;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);

doTransaction(3, "0701010390000001");
doTransaction(1, "0701010380200001");
