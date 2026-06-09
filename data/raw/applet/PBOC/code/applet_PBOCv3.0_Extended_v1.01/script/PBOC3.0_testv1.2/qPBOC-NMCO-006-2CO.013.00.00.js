/*******************************************
 Test Name  : Static Signed Data - (Online)
 Card Image : PBOC-PSO-035-(for NMCO3)
 Reference  : VCPS 2CO.013.00.00
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-NMCO-006-2CO.013.00.00');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Transaction_Currency_Code = Transaction_Currency_Code;	 

Terminal_Transaction_Qualifiers = "00000000";
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW("9000");

Read_Record();

check_result(GPOresponse);


function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(AFL == "") error("Application File Location doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	
	SDAD = lookup_BER_TLV(value_77, "9F4B", RETURN_VALUE);
	AOSA = lookup_BER_TLV(send_GetData("9F5D"), "9F5D", RETURN_VALUE);
	
	if(SDAD == "") error("Signed Dynamic Application Data doesn't exist");
	if(AOSA == "") error("Available Offline Spending Amount doesn't exist");
	
	checkIAD("0701010390000001", "0701110390000001", 8);
		
	validate_AC(AC);
};
