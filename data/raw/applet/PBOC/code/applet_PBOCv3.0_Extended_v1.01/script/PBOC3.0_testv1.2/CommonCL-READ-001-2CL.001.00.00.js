/*******************************************
 Test Name  : READ RECORD - Class, INS, P2 and P2
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CL.001.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-READ-001-2CL.001.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW("9000");


print("\n* Case 01 : CLA outside the range ('04' - 'FF')");
check_READ_002_CLA("04", "FF");

print("\n* Case 02 : INS in the range pf '00' to '1F'");
check_READ_002_INS("00", "1F");

print("\n* Case 03 : INS in the range pf '20' to '83'");
check_READ_002_INS("20", "83");

print("\n* Case 04 : INS in the range pf '85' to '87'");
check_READ_002_INS("85", "87");

print("\n* Case 05 : INS in the range pf '89' to 'A3'");
check_READ_002_INS("89", "A3");

print("\n* Case 06 : INS in the range pf 'A5' to 'B1'");
check_READ_002_INS("A5", "B1");

print("\n* Case 07 : INS in the range pf 'B3' to 'FF'");
check_READ_002_INS("B3", "FF");

print("\n* Case 08 : P1 outside the range");
print("* Case 09 : P2 outside the range");
print("[User Check] : sneds READ RECORD command for P1 and P2 outside the range");

function check_READ_002_CLA(start, end){
	start = to_val(start);
	end   = to_val(end);
	
	for(i=start; i<=end; i++){
		send(to_hex(i, 1)+ "B2 0224 00"); // should use 'PBOC-PSO-031'
		SW = getSW();
		if(SW == "9000") error("SW should not be '9000'.");
	}
}

function check_READ_002_INS(start, end){
	start = to_val(start);
	end   = to_val(end);
	
	for(i=start; i<=end; i++){
		send("80" + to_hex(i, 1)+ "0224 00"); // should use 'PBOC-PSO-031'
		SW = getSW();
		if(SW == "9000") error("SW should not be '9000'.");
	}
}



