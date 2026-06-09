/*******************************************
 Test Name  : GET DATA - unsupported tags
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.011.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-GET-001-2CC.011.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

//check_GET_001("0000", "3FFF");
//check_GET_001("4000", "6FFF");
//check_GET_001("7000", "9EFF");
check_GET_001("9F00", "9F12");
check_GET_001("9F14", "9F16");
check_GET_001("9F18", "9F35");
check_GET_001("9F37", "9F41");
check_GET_001("9F43", "9F4D"); //9F42 PBOC
check_GET_001("9F50", "9F50"); //9F4E 9F4F PBOC 
check_GET_001("9F53", "9F52"); //9F53 PBOC 
//check_GET_001("9F5A", "9F67");
check_GET_001("9F69", "9F6A");
check_GET_001("9F6C", "9F6C");
check_GET_001("9F6C", "9F6C");
check_GET_001("9F6E", "9F71");
check_GET_001("9F80", "9FFF");


function check_GET_001(start, end){
	start = to_val(start);
	end   = to_val(end);
	
	for(i=start; i<=end; i++){
		send("80CA"+ to_hex(i, 2) + "00");
		SW = getSW();
		if(SW == "9000") error("SW should not be '9000'.");
	}
}


