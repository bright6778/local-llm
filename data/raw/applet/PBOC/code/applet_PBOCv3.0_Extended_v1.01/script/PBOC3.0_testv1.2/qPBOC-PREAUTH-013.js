/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

print('\n* Test Case : qPBOC-Extended-IMAGE46-013');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');
/*
Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_new.js");

Record_In_19[1]="00017D"+random(125);
print("Record_In_19[1]="+Record_In_19[1]);

AppendRecord("C8",Record_In_19[1],Ini_key_19,CAPP_KEY_19[1]);
assertSW("9000");
*/
print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='02';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

send_GPO_new();
assertSW("6985");

print("\n* ******************************");
print("\n* Transaction 3");
print("\n* ******************************");
CAPP_ID_DF60='01';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

send_GPO_new();
//assertSW("6985");
//assertSW("9000"); // modified at v1.10
sw = getSW();
if(sw != '6985' && sw != '9000'){
	error('SW is wrong!!!');
}
print("\n* ******************************");
print("\n* Transaction 4");
print("\n* ******************************");
CAPP_ID_DF60='03';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

send_GPO_new();
assertSW("6985");

