/*******************************************
 Test Name  : READ RECORD - AFL with SFI in range [1, 10]
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CL.002.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-READ-002-2CL.002.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

GPOresponse = send_GPO(CVN);
assertSW("9000");

var i = 0;
while(true){
	if(AFL % 8 != 0) break;
	//if(SFI == 0) break;
	
	SFI = AFL.substring(i, i+8);
	SFI = parseInt(SFI, 16);	
	if(SFI < 1 || SFI > 10) error("SFI's range shall be 0 to 10");
	i += 8; 
}