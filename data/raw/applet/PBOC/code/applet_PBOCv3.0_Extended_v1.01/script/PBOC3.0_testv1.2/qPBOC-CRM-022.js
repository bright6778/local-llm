/*******************************************
 Test Name  : Reset VLP Avaiable Funds - Issuer Script Processing (VLP Low Value Option)
 Card Image : PBOC-PSO-042-(for qPBOC-CRM-022)
 Reference  : VCPS 2CE.022.00.00
 Card Conf  : [Contact VSDC ADA] 
                - Byte 2 bit 2 = 1 'Do not reset Cumulative Total Transaction Amount ( CTTA ) to zero druing GEN AC'
                - Byte 2 bit 1 = 1 'Do not reset VLP Available Funds during GEN AC'
			  [Card Transaction Qualifier]
			    - Byte 1 bit 6 = 1 'Go Online if Offline Data Authentication Fails and Reader is online capable'
			    - Byte 1 bit 5 = 1 'Terminate if Offline Data Authentication Fails and Reader supports contact VSDC'
			  [Card Additional Process]
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'			  	
			  	- Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'
			  	- Byte 2 bit 7 = 0 'Transaction in non-matching currency are allowed'			  	
			  	- Byte 3 bit 8 = 1 'Online PIN supported for matching currency'
			  	- Byte 3 bit 7 = 1 'Online PIN supported for non-matching currency'
			  	- Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
			  	- Byte 3 bit 5 = 1 'Signature supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-022');

/////////////////////// CASE 01 ///////////////////////////
init(CL_PORT, CL_READER);
print('\n* Case 01: qVSDC VLP Low Value Offline Approval');
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

var responseGPO = send_GPO(CVN);
assertSW('9000');

VLP_Funds = send_GetData('9F79');
VLP_Funds = lookup_BER_TLV(VLP_Funds, '9F79', RETURN_VALUE);
assertSW('9000');

checkIAD('0701010390000001', '', 8);

var value_77 = lookup_BER_TLV(responseGPO, "77", RETURN_VALUE);
assertEquals(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE), "7000");

reset();
select_PBOC();

VLP_Funds = send_GetData('9F79');
assertSW("9000");

/////////////////////// CASE 02 ///////////////////////////
init(CT_PORT, CT_READER);
print('\n* Case 02: Contact VSDC - Cleaning the Card with EXTERNAL AUTHENTICATE (CLN001)');
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();
include("qPBOC-CLN-001.js");


/////////////////////// CASE 03 ///////////////////////////
print('\n* Case 03: Contact VSDC - Approved online with Issuer Script with a valid MAC.');
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO('831F015601000000000000015642616E6B436172645465737443656E7465722020');
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
set_AA_forVC(AA_60);
send_GEN_AC1_forVC(ARQC);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
set_AA_forVC(AA_60);
send_GEN_AC2_forVC(TC);
assertSW('9000');
/* Set VLP_Funds to VLP_Funds_Limit
 * According to VCPS 2.0.2
 * If Contact VSDC ADA Byte 2 bit 1 set as 1, 
 * VLP_Funds is changed to VLP_Funds_Limit 
 * during Put Data to VLP Available Funds Limit is Successful */


VLP_Funds = lookup_BER_TLV(VLP_Funds, "9F79", RETURN_VALUE)
print("9F79 (VLP_Available_Funds) : " + VLP_Funds);

send_PutData("9F77", VLP_Funds); 
assertSW("9000");

/////////////////////// CASE 04 ///////////////////////////
init(CL_PORT, CL_READER);
print('\n* Case 04: qVSDC VLP Low Value Offline Approval ? VLP Available Funds was reset with VLP Funds Limit in the above transaction during Issuer Script processing');
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();
include("qpboc_offline approval.js");

select_PBOC();

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
VLP_Funds_limit = send_GetData('9F77');
VLP_Funds_limit = lookup_BER_TLV(VLP_Funds_limit, "9F77", RETURN_VALUE);
VLP_after 		= lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE);

print('VLP_after         : ' + VLP_after);
print('VLP_Funds_limit   : ' + VLP_Funds_limit);
print('Amount_Authorised : ' + Amount_Authorised);

if(parseInt(VLP_after, 10) != parseInt(VLP_Funds_limit, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify the new VLP Available Funds is same as VLP Funds Limit - Amount, Authorized");

checkIAD('0701010390000001', '', 8)

// Card Transaction Qualifiers check
assertEquals(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE), "3000"); 


/////////////////////// CASE 05 ///////////////////////////
init(CT_PORT, CT_READER);
print('\n* Case 05: Contact VSDC - Approved Online. Since no issuer script processing is used the VLP Available Funds remains at the end of the transaction');
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();
include("qPBOC-CLN-001.js");


/////////////////////// CASE 06 ///////////////////////////
init(CL_PORT, CL_READER);
print('\n* Case 06: qVSDC VLP Low Value Offline Approval. To verify VLP Available Funds is not changed during the above transaction with out issuer script processing');
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_2);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);

response = send_GPO(CVN);
assertSW('9000');

value_77 = lookup_BER_TLV(response, "77", RETURN_VALUE);

VLP_Funds = send_GetData('9F79');
VLP_Funds = lookup_BER_TLV(VLP_Funds, '9F79', RETURN_VALUE);

assertSW('9000');

checkIAD('0701010390000001', '', 8);

if(parseInt(VLP_Funds, 10) != parseInt(VLP_after, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify VLP Available Funds = VLP Available Funds returned in Case 04 - Amount, Authorized");

assertEquals(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE), "7000");
