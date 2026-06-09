/*******************************************
 Test Name  : Decline qVSDC Transaction (PIN Try Exceeded & Offline only Reader)
 Card Image : PBOC-PS0-039
 Reference  : VCPS 2CE.003.00.00
 Card Conf  : PIN Try Counter('9F17') = 0
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CRM-003');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

var response = send_GetData('9F17');
print("count : "+response);
assertSW('9000');

for(i=0; i<response.substring(6,8); i++){
	send_Verify('80', TEST_PLAIN_PIN_INVALID);	
}

print("\n* Transaction 2");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

response = send_GPO(CVN);
assertSW('9000');

//checkIAD("0701010380400001", "0701110380400001", 8);
parse_IAD(Issuer_Application_Data);
check_IAD(Issuer_Application_Data, '804000');

//PTC 초기화 위해 pin unblock
//include("pboc_PinUnBlk.js");



