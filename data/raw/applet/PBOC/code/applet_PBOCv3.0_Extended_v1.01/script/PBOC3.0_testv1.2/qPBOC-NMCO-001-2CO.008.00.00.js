/*******************************************
 Test Name  : Consecutive Transaction Counter International
 Card Image : PBOC-PSO-035-(for NMCO1)
 Reference  : VCPS 2CO.009.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-NMCO-001-2CO.008.00.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

//CTCI Consecutive Transaction Counter (International)
//CTLI Consecutive Transaction Limit (International) -> 9F53
//OCIV Offline Counter Initial Value(PBOC3.0 Not Supported)

///////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : CVM Required by card for non-matching currency - Offline Transaction");

Transaction_Currency_Code = Transaction_Currency_Code_Diff;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);

doTransaction(5, "0701010390000001");

///////////////////////// Case 02 ////////////////////////////
print("\n* Case 02 : CVM Required by reader for non-matching currency - Offline Tranasaction");

Transaction_Currency_Code = Transaction_Currency_Code_Diff;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

doTransaction(5, "07010103A0200001");

///////////////////////// Case 03 ////////////////////////////
print("* Case 03 : CVM Required by reader for non-matching currency - Decline Tranasaction")

Transaction_Currency_Code = Transaction_Currency_Code_Diff;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

doTransaction(5, "0701010380200001");