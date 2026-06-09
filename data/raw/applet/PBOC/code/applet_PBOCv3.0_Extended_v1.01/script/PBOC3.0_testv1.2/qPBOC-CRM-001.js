/*******************************************
 Test Name  : Decline qVSDC Transaction (non-matching currency not allowed)
 Card Image : PBOC-PSO-033
 Reference  : VCPS 2CE.001.00.00
 Card Conf  : [Card Transaction Qualifiers] personalized
              [Card Additional Processes]
                Byte2의 bit7을 1로 설정 - Trasncation in non matching currency ard not allowed
                Byte1의 bit1을 1로 설정 - Return Available Offine Spending Amount  
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-001');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

response = send_GPO(CVN);
assertSW('9000');

assertEquals(response.substring(0, 2), '77');
reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");	
if(AC == "") error("Application Cryptogram doesn't exist");
if(AFL != "") error("AFL should not be present in GPO response");
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '800000');
validate_AC(AC);