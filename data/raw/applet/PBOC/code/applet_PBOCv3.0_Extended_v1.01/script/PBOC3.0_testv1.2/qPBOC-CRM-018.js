/*******************************************
 Test Name  : VSDC Online approved transaction resets VLP Available Funds (1)
 Card Image : PBOC-PSO-042-(for qPBOC-CRM-016,017,018)
 Reference  : VCPS 2CE.018.00.00
 Card Conf  : [Card Transaction Qualifier] 
                - Byte 1 bit 6 = 1 'Go Online if Offline Data Authentication Fails and Reader is online capable'
                - Byte 1 bit 5 = 1 'Terminate if Offline Data Authentication Fails and Reader supports contact VSDC'
			  [Card Additional Process] 
			  	- Byte 1 bit 8 = 1 'Low Value Check Supported'
			  	- Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'
			  	- Byte 2 bit 7 = 0 'Transaction in non-matching currency are allowed'			  	
			  	- Byte 3 bit 8 = 1 'Online PIN supported for matching currency'
			  	- Byte 3 bit 7 = 1 'Online PIN supported for non-matching currency'
			  	- Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
			  	- Byte 3 bit 5 = 1 'Signature supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-018');

print('\n* Power on the Card(ATR)');

/////////////////////// CASE 01 ///////////////////////////
init(CL_PORT, CL_READER); //ªÛ»≤ø° µ˚∂Û πŸ≤„¡‡æﬂ«‘ (Port, Reader) 
reset(); 
print('\n* Case 01: qVSDC transaction for offline approval');
include("qpboc_offline approval.js");

//checkIAD('0701010390000001', '', 8)
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

print("VLP_after : "+lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE));
print("VLP_proir: "+VLP_proir);
print("Amount, Authorised : "+parseInt(Amount_Authorised, 10));

VLP_after = lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE);
VLP_proir = lookup_BER_TLV(VLP_proir, "9F79", RETURN_VALUE);

if(parseInt(VLP_after, 10) != parseInt(VLP_proir, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify VLP Available Funds (after GPO) = VLP Available Funds (prior GPO) - Amount, Authorized");


/////////////////////// CASE 02 ///////////////////////////
init(CT_PORT, CT_READER); 
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();

print('\n* Case 02: Contact VSDC online approved transaction to reset VLP Available Funds to VLP Funds Limit');

print('\n* Test Case : CLN001');
Terminal_Transaction_Qualifiers = "00000000";
select_PBOC();
assertSW('9000');
send_GPO("831F015601000000000000015642616E6B436172645465737443656E7465722020"); //Make PDOL for contact
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');


/////////////////////// CASE 03 ///////////////////////////
init(CL_PORT, CL_READER); 
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset(); 

print('\n* Case 03: qVSDC transaction for offline approval');

include("qpboc_offline approval.js");
VLP_limit = send_GetData('9F77');
assertSW('9000');

//checkIAD("0701010390000001", "", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '900000');

VLP_after = lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE);
VLP_limit = lookup_BER_TLV(VLP_proir, "9F79", RETURN_VALUE);

if(parseInt(VLP_after, 10) != parseInt(VLP_limit, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify the new VLP Available Funds is same as VLP Funds Limit - Amount, Authorized");	
	