/*******************************************
 Test Name  : GPO Command - INS byte range
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.002.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-GPO-002-2CD.002.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

//////////////////// Case 01 ////////////////////
print("\n Case 01 : INS range 'A1' - 'A7'");
check_GPO_002('A1', 'A7');

//////////////////// Case 02 ////////////////////
print("\n Case 01 : INS range 'A9' - 'AF'");
check_GPO_002('A9', 'AF');

function check_GPO_002(start, end){
	start = to_val(start);
	end   = to_val(end);
	
	for(i=start; i<=end; i++){
		send("80"+ to_hex(i, 1) +"000023832120000000000000000100000000000000015600000000000156000125001234567800");
		SW = getSW();
		if(SW == "9000") error("SW should not be '9000'.");
	}
}



