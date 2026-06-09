/*******************************************
 Test Name  : Terminate qVSDC transaction when Card Prefers Contact VSDC for online
 Card Image : PBOC-PSO-031-(for qPBOC-CRM-014)
 Reference  : VCPS 2CE.014.00.00
 Card Conf  : [Application Currency Code]
              [Card Transaction Qualifiers]
              [Card Additional Processes] 
                - Byte 1 bit 2 = 1 'Card Prefers Contact VSDC for Online'
                - Byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'
                - Byte 3 bit 8 = 1 'Online PIN Supported for matching currency'                                
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-014');


print('\n* Power on the Card(ATR)');
reset();

print('\n* Case 01: TTQ with contactless qVSDC and contact VSDC for online cryptogram');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_3);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_5);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_7);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

response = send_GPO(CVN);
assertSW('6985');

print('\n* Case 02: TTQ with contact VSDC for online cryptogram');
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;

Terminal_Transaction_Qualifiers = '00000000';
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_5);
BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

response = send_GPO(CVN);
assertSW('6700');


