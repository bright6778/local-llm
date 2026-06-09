/*******************************************
 Test Name  : GPO Command - CLASS byte range
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.001.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-GPO-001-2CD.001.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

check_GPO_001('84', '8F');

function check_GPO_001(start, end){
	start = to_val(start);
	end   = to_val(end);
	
	for(i=start; i<=end; i++){
		send(to_hex(i, 1)+"A8000023832120000000000000000100000000000000015600000000000156000125001234567800");
		SW = getSW();
		if(SW == "9000") error("SW should not be '9000'.");
	}
}


