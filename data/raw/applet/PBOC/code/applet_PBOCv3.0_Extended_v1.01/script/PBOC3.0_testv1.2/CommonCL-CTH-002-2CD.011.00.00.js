/*******************************************
 Test Name  : Wrong PDOL for qVSDC path
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.011.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-CTH-001-2CD.011.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);

//Correct PDOL in GPO
//send("80A8000023 83 21 20000000000000000100000000000000015600000000000156000125001234567800");

print("\n* Case 01 : tag 83 length not consistent");
send("80A8000022 83    20000000000000000100000000000000015600000000000156000125001234567800");
check_PDOL_SW_is9000();

print("\n* Case 02 : without tag 83 (and length)");
send("80A8000021       20000000000000000100000000000000015600000000000156000125001234567800");
check_PDOL_SW_is9000();

print("\n* Case 03 : tag 83 with a wrong length");
send("80A8000023 83 22 20000000000000000100000000000000015600000000000156000125001234567800");
check_PDOL_SW_is9000();

print("\n* Case 04 : data field consistent with expected PDOL");
send("80A8000023 83 21 12345678200000000000000001000000000000000156000000000001560001250000");
check_PDOL_SW_is9000();

function check_PDOL_SW_is9000(){
	SW = getSW();
	if(SW == "9000") error("the GPO shall be rejected ( SW diffrent from '9000')");	
}