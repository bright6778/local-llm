/*******************************************
 Test Name  : Undocumented Commands Search 
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CP.005.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-UNDOC-005-2CP.005.00.00');

print('\n* Power on the Card(ATR)');
reset();

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

print("\n* Case 01 : ... n : CLA range '00' - 'FF' and INS range '00' - 'FF' [PPSE]");

//select_PPSE();
//assertSW('9000');
loopSendCommand_for_UNDOC_005();


print("\n* Case 02 : ... n : CLA range '00' - 'FF' and INS range '00' - 'FF' [PBOC]");

//select_PPSE();
//assertSW('9000');
select_PBOC();
assertSW('9000');
loopSendCommand_for_UNDOC_005();

function loopSendCommand_for_UNDOC_005(){
	for(i=0; i<=256; i++){
		for(var j=0; j<96; j++){
			send(to_hex(i, 1)+to_hex(j,1)+"0000 00");
			SW = getSW();
			if(SW == "9000") error("SW shall be different form '9000'");			
		}
		for(var j=113; j<144; j++){
		  //if(to_hex(i, 1) == "00" && to_hex(j, 1) == "70") continue; //0070000000
			send(to_hex(i, 1)+to_hex(j,1)+"0000 00");
			SW = getSW();
			if(SW == "9000") error("SW shall be different form '9000'");			
		}
		for(var j=160; j<256; j++){
			if(to_hex(i, 1) == "FF" && to_hex(j, 1) == "CA") continue; //FFCA000000
			send(to_hex(i, 1)+to_hex(j,1)+"0000 00");
			SW = getSW();
			if(SW == "9000") error("SW shall be different form '9000'");			
		}
	}
}

