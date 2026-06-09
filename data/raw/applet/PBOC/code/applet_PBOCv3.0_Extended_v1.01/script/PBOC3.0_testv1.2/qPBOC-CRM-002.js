/*******************************************
 Test Name  : Decline qVSDC Transaction (New Card and reader is offline only)
 Card Image : PBOC-PSO-031(VISA)
 Reference  : VCPS 2CE.002.00.00
 Card Conf  : [Card Transaction Qualifiers] personalized
              [Card Additional Processes]
                Byte2의 bit6을 1로 설정 - Decline Transaction if New Card and reader is offline only
                Byte1의 bit5을 1로 설정 - New Card Check Supported
                Byte1의 bit8을 1로 설정 - Low Value Check Supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID

 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-002');

print("***********************CAUTION!!!************************");
print(' NEW CARD');
print("*********************************************************");

print("\n* Case 01: Offline only reader");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = "28000000";
send_GPO(CVN);
assertSW('9000');

print("Last Online ATC : "+send_GetData('9F13'));
assertSW('9000');

//checkIAD("0701010380000001", "0701110380000001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '800000');

print("\n* Case 02: Online capable reader");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = "20000000";
send_GPO(CVN);
assertSW('9000');

send_GetData('9F13');
assertSW('9000');

//checkIAD("07010103A0100001", "07011103A0100001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A01000');

print("\n* Case 03: Offline only reader");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = "28000000";
send_GPO(CVN);
assertSW('9000');

Read_Record();

send_GetData('9F13');
assertSW('9000');

//checkIAD("0701010390000001", "0701110390000001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '800000');

print("\n* Case 04: Online capable reader");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');

Terminal_Transaction_Qualifiers = "20000000";
send_GPO(CVN);
assertSW('9000');

Read_Record();

send_GetData('9F13');
assertSW('9000');

//checkIAD("0701010390000001", "0701110390000001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, 'A01000');