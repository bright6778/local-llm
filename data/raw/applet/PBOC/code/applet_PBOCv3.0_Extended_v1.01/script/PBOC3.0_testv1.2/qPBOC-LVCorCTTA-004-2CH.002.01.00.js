/*******************************************
 Test Name  : qVSDC Low Value or CTTA Check - Online processing 
 Card Image : PBOC-PSE-035-(for LVCorCTTA with CTTAUL)
 Reference  : VCPS 2CG.002.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 6 = 1 'Low Value AND CTTA Check Support']			 	 
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'  
 			  [CTTAL '9F54']
 			  [CTTAUL '9F5C'] personalized
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCorCTTA-004-2CG.002.01.00');

print('\n* Power on the Card(ATR)');
reset();

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised > VLP Available Funds");
select_PBOC();
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

Amount_Authorised = '000000005500';

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

check_result(GPOresponse);

function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	
	checkIAD("07010103A0200001", "07011103A0200001", 8);
		
	validate_AC(AC);
};