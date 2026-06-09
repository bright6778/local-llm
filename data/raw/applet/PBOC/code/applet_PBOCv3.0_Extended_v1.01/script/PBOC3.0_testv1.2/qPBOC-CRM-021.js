/*******************************************
 Test Name  : VSDC Online approved transaction resets VLP Available Funds (5)
 Card Image : PBOC-PSO-042-(for qPBOC-CRM-021)
 Reference  : VCPS 2CE.021.01.00
 Card Conf  : [Card Transaction Qualifier] 
                - Byte 1 bit 6 = 1 'Go Online if Offline Data Authentication Fails and Reader is online capable'
                - Byte 1 bit 5 = 1 'Terminate if Offline Data Authentication Fails and Reader supports contact VSDC'
			  [Card Additional Process] 
			  	- Byte 1 bit 7 = 1 'Low Value AND CTTA Check Supported'
			  	- Byte 1 bit 4 = 1 'PIN Tries Exceeded Check Supported'
			  	- Byte 2 bit 7 = 0 'Transaction in non-matching currency are allowed'			  	
			  	- Byte 3 bit 8 = 1 'Online PIN supported for matching currency'
			  	- Byte 3 bit 7 = 1 'Online PIN supported for non-matching currency'
			  	- Byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
			  	- Byte 3 bit 5 = 1 'Signature supported'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-021');


/////////////////////// CASE 01 ///////////////////////////
init(CT_PORT, CT_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();

print('\n* Case 01: Contact PBOC - online approved transaction to reset Offline Counters');

include('qPBOC-CLN-001.js');

CTTAL = send_GetData('9F54');
assertSW('9000');
AOSA = send_GetData('9F5D');
assertSW('9000');
VLP_Funds = send_GetData('9F79');
assertSW('9000');
VLP_Funds_limit = send_GetData('9F77');
assertSW('9000');

print("CTTAL :"+CTTAL);
print("AOSA : "+AOSA);
print("VLP_Funds :"+VLP_Funds);
print("VLP_Funds_limit : "+VLP_Funds_limit);

var value_CTTAL = lookup_BER_TLV(CTTAL, "9F54", RETURN_VALUE);
var value_AOSA = lookup_BER_TLV(AOSA, "9F5D", RETURN_VALUE);
var value_VLP_Funds = lookup_BER_TLV(VLP_Funds, "9F54", RETURN_VALUE);
var value_VLP_Funds_limit = lookup_BER_TLV(VLP_Funds_limit, "9F5D", RETURN_VALUE);
if(value_CTTAL != value_AOSA) error("failed verify AOSA is same as CTTA Limit");
if(VLP_Funds != VLP_Funds_limit) error("failed VLP Available Funds is same as VLP Funds Limit"); //why don't be fill VLP_Fuds as VLP_Funds_limit


/////////////////////// CASE 02 ///////////////////////////
init(CL_PORT, CL_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();

print("\n* Case 02: qVSDC transaction for offline approval");
include("qpboc_offline approval.js");

checkIAD('0701010390000001', '', 8);

print('VLP_after : ' + lookup_BER_TLV(VLP_after, '9F79', RETURN_VALUE));
print('VLP_proir : ' + lookup_BER_TLV(VLP_proir, '9F79', RETURN_VALUE));
print('Amount_Authorised : ' + Amount_Authorised);

VLP_after = lookup_BER_TLV(VLP_after, '9F79', RETURN_VALUE);
VLP_proir = lookup_BER_TLV(VLP_proir, '9F79', RETURN_VALUE);

if(parseInt(VLP_after, 10) != parseInt(VLP_proir, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify VLP Available Funds (after GPO) = VLP Available Funds (prior GPO) - Amount, Authorized");

var VLP_Funds_2 = VLP_after; //for Case 3

reset();
select_PBOC();
VLP_Funds = send_GetData('9F79');
print("VLP : " + VLP_Funds);
pause();

/////////////////////// CASE 03 ///////////////////////////
init(CT_PORT, CT_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();
Terminal_Transaction_Qualifiers = "00000000";

print('\n* Case 03: Contact VSDC ? EXTERNAL AUTHENTICATE command with invalid ARPC (No change to Offline Counters)');
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO('831F015601000000000000015642616E6B436172645465737443656E7465722020');
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth_InvalidARPC();
//assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

CTTAL = send_GetData('9F54');
assertSW('9000');
VLP_Funds = send_GetData('9F79');
assertSW('9000');
VLP_Funds_limit = send_GetData('9F77');
assertSW('9000');

print("AOSA : "+AOSA);
print("AOSA2 : "+AOSA);
print("VLP_Funds :"+VLP_Funds);
print("VLP_Funds_limit : "+VLP_Funds_limit);

print('VLP_Funds_2 (case 2 funds) : '+VLP_Funds_2); 
if(VLP_Funds_2 != VLP_Funds) error("faield verify VLP Available Funds (after GPO) is same as in case 02");
if(AOSA_2 != AOSA) error("faield verify AOSA (after GPO) is same as in case 02");


/////////////////////// CASE 04 ///////////////////////////
init(CL_PORT, CL_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();

print("\n* Case 04: qVSDC transaction for offline approval");
include("qpboc_offline approval.js");

checkIAD('0701010390000001', '', 8);

VLP_after = lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE);
VLP_proir = lookup_BER_TLV(VLP_proir, "9F79", RETURN_VALUE);
VLP_Funds_2 = VLP_after;

if(parseInt(VLP_after, 10) != parseInt(VLP_proir, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify VLP Available Funds (after GPO) = VLP Available Funds (prior GPO) - Amount, Authorized");

print('VLP_after : '+ VLP_after);

/////////////////////// CASE 05 ///////////////////////////
init(CT_PORT, CT_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();
Terminal_Transaction_Qualifiers = "00000000";

print('\n* Case 05: Contact VSDC ? without EXTERNAL AUTHENTICATE command');
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO('831F015601000000000000015642616E6B436172645465737443656E7465722020');
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW('9000');

CTTAL = send_GetData('9F54');
assertSW('9000');
VLP_Funds = send_GetData('9F79');
assertSW('9000');
VLP_Funds_limit = send_GetData('9F77');
assertSW('9000');

VLP_Funds = lookup_BER_TLV(VLP_Funds, "9F79", RETURN_VALUE);
VLP_Funds_limit = lookup_BER_TLV(VLP_Funds_limit, "9F77", RETURN_VALUE);

compareData('VLP_Funds', VLP_Funds, 'VLP_Funds_2', VLP_Funds_2);

if(VLP_Funds_2 != VLP_Funds) error("faield VLP Available Funds (after GPO) is same as in case 04");
if(AOSA_2 != AOSA) error("faield verify AOSA (after GPO) is same as in case 04");


/////////////////////// CASE 06 ///////////////////////////
init(CL_PORT, CL_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();

print("\n* Case 06: qVSDC transaction for offline approval");
include("qpboc_offline approval.js");

checkIAD('0701010390000001', '', 8);

VLP_after = lookup_BER_TLV(VLP_after, "9F79", RETURN_VALUE);
VLP_proir = lookup_BER_TLV(VLP_proir, "9F79", RETURN_VALUE);

if(parseInt(VLP_after, 10) != parseInt(VLP_proir, 10) - parseInt(Amount_Authorised, 10))
	error("failed verify VLP Available Funds (after GPO) = VLP Available Funds (prior GPO) - Amount, Authorized");


/////////////////////// CASE 07 ///////////////////////////
init(CT_PORT, CT_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
reset();

print('\n* Case 07: Contact VSDC - online approved transaction to reset Offline Counters');
include('qPBOC-CLN-001.js');


CTTAL = send_GetData('9F54');
assertSW('9000');
AOSA = send_GetData('9F5D');
assertSW('9000');
VLP_Funds = send_GetData('9F79');
assertSW('9000');
VLP_Funds_limit = send_GetData('9F77');
assertSW('9000');

print("CTTAL :"+CTTAL);
print("AOSA : "+AOSA);
print("VLP_Funds :"+VLP_Funds);
print("VLP_Funds_limit : "+VLP_Funds_limit);
var value_CTTAL = lookup_BER_TLV(CTTAL, "9F54", RETURN_VALUE);
var value_AOSA = lookup_BER_TLV(AOSA, "9F5D", RETURN_VALUE);
var value_VLP_Funds = lookup_BER_TLV(VLP_Funds, "9F54", RETURN_VALUE);
var value_VLP_Funds_limit = lookup_BER_TLV(VLP_Funds_limit, "9F5D", RETURN_VALUE);

if(value_CTTAL != value_AOSA) error("failed verify AOSA is same as CTTA Limit");
//if(VLP_Funds != VLP_Funds_limit) error("failed VLP Available Funds is same as VLP Funds Limit"); //why don't be fill VLP_Fuds as VLP_Funds_limit

//Reset to contactless
init(CL_PORT, CL_READER);
print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
reset();