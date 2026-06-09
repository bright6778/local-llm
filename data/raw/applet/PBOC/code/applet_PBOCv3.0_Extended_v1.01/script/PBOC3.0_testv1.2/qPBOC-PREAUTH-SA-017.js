/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE48-001');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');

Terminal_Transaction_Qualifiers = '40000000';

//include("pboc_CLN001_new.js");
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

ATC=send('80CA9F36');
ATC=ATC.substr(6,4);
print("ATC="+ATC);

Record_In_19[1]="000135"+random(53);
print("Record_In_19[1]="+Record_In_19[1]);

AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");


print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '26000080';
CAPP_ID_DF60='01';
Amount_Authorised = '000000000001';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");


		Record_Out_19[1]=ReadCappData("C8",Record_In_19[1].substr(0,4));
    assertSW("9000");
		if (Record_Out_19[1]!=Record_In_19[1]){
			error("Read SFI=0x19 error");
}

Transaction_Currency_Code = Terminal_Country_Code = QPBOC_EC_SECOND_CURRENCY_CODE;send_GPO_new();
assertSW("9000");

Record_In_19[1]=Record_In_19[1].substr(0,4)+"35"+random(53);
UpdateCappDataCache("C8",Record_In_19[1],CAPP_KEY_19[1]);

ReadAFL();


