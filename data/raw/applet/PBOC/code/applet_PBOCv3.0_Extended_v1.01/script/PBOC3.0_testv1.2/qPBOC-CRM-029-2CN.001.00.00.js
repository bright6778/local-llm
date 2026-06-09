/*******************************************
 Test Name  : qVSDC - Declined Transaction
 Card Image : PBOC-PSO-036-(for qPBOC-CRM-029)
 Reference  : VCPS 2CN.001.00.00
 Card Conf  : [Application Currency Code] 
              [Card Transaction Qualifier]            
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
              PIN Try Counter = 0
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-029-2CN.001.00.00.js');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
Amount_Authorised = parseInt(VLP_Funds, 10) + 100;
Amount_Authorised = intToStr(Amount_Authorised, 6);

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

send_GPO(CVN);
assertSW('9000');

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC == "")  error("Application Cryptogram doesn't exist");
if(Track2_Equivalent_Data == "")  error("Track 2 Equivalent Data doesn't exist");

//checkIAD("0701010380200001","0701110380200001",8)
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '802000');
validate_AC(AC);