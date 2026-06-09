/*******************************************
 Test Name  : Terminate qPBOC transaction - matching currency(Amount, Authorised > Card_CVM_List)
 Card Image : PBOC-PSO-041
 Reference  : VCPS 2CE.006.00.00
 Card Conf  : [CAP] byte 3 bit 5 = 1 'Signature supported'
                    byte 3 bit 6 = 1 'CVM required by card for non-matching currency'
                    byte 3 bit 7 = 1 'Online PIN Supported for non-matching currency'
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

//include("Images\\PBOC-PSO-041.js");

print('\n* Test Case : qPBOC-CRM-006');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

Card_CVM_Limit = send_GetData('9F6B');
assertSW('9000');
Card_CVM_Limit = lookup_BER_TLV(Card_CVM_Limit, '9F6B', RETURN_VALUE);
Amount_Authorised =  to_hex(to_val(Card_CVM_Limit) + 100);
while(Amount_Authorised.length < 12) Amount_Authorised = "0" + Amount_Authorised;

print("Card_CVM_List : "+ Card_CVM_Limit);
print("Amount_Authorised : "+ Amount_Authorised);

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);

assertSW('6985');





