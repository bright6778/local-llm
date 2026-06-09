/*******************************************
 Test Name  : GPO response in EMV Format 2
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.005.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : CommonCL-GPO-003-2CD.005.00.00');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');


print("\n* Case 01 : Terminal Transaction Qualifier RFU bits value set to '0'");
Terminal_Transaction_Qualifiers = "28000000";
GPOresponse = send_GPO(CVN);
assertSW("9000");

check_result(GPOresponse);	

function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AFL == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");	
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	
	if(AFL.length/2 > 252 || AFL.length/2 % 4 != 0)
		error("The AFL length shall be a mutiple of 4 and less than or equal 252."); 
};
