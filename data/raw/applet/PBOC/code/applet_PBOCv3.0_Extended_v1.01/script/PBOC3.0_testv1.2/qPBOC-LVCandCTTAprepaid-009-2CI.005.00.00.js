/*******************************************
 Test Name  : qVSDC Prepaid for Low Value AND CTTA Check - Online approval 
 Card Image : PBOC-PSO-035-(for LVCandCTTA)
 Reference  : VCPS 2CI.005.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Support'
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			 	- Byte 2 bit 8 = 1 'Prepaid Supported'					 	 
			 	- Byte 2 bit 7 = 1 'Transaction in non-matching currency are not allowed'
			  [Cumulative Transaction Total Amount Limit '9F54'] personalized          
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVCandCTTAprepaid-009-2CI.005.00.00');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

//////////////////////// Case 01 ////////////////////////////
print("\n* Case 01 : Amount, Authorised 	   < VLP Available Funds");
print("\n*         : Amount, Authorised + CTTA < CTTAL");
select_PBOC();
assertSW('9000');

Amount_Authorised = "000000000010";
VLP_Funds_prior = parseInt(lookup_BER_TLV(send_GetData("9F79"), "9F79", RETURN_VALUE), 10);

GPOresponse = send_GPO(CVN);
assertSW('9000');

Read_Record();

VLP_Funds_after = parseInt(lookup_BER_TLV(send_GetData("9F79"), "9F79", RETURN_VALUE), 10);

if(VLP_Funds_after != VLP_Funds_prior - parseInt(Amount_Authorised, 10))
	error("Verify that VLP Available Funds after GOP = VLP Available Funds(prior to GPO) - Amount, Authorised");

check_result(GPOresponse);


function check_result(GPOresponse){
	value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
	
	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(AC == "")  error("Application Cryptogram doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");

	checkIAD("07010103A0000001", "07011103A0000001", 8);
		
	validate_AC(AC);
		
};
