/*******************************************
 Test Name  :
 Card Image : 
 Reference  : 
 *******************************************/

include("_PBOC_COMMON_FOR_EXTENDED.js");

var AC_GET;

print('\n* Test Case : qPBOC-Extended-IMAGE46-002');
print("\n* ******************************");
print("\n* Transaction 1");
print("\n* ******************************");
print('\n* Power on the Card(ATR)');

/*
Terminal_Transaction_Qualifiers = '40000000';

include("pboc_CLN001_new.js");

Record_In_1E[1]=random(128);
print("Record_In_1E[1]="+Record_In_1E[1]);

AppendRecord("F0",Record_In_1E[1],Ini_key_1E,CAPP_KEY_1E[1]);
assertSW("9000");
*/

print("\n* ******************************");
print("\n* Transaction 2");
print("\n* ******************************");
is_qPBOC=true;
Terminal_Transaction_Qualifiers = '20000000';
CAPP_ID_DF60='01';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Record_Out_1E[1]=send('00B201F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_1E[1]=random(128);
UpdateCappDataCache("F0",Record_In_1E[1],CAPP_KEY_1E[1]);
Record_In_1E[2]=random(128);
UpdateCappDataCache("F0",Record_In_1E[2],CAPP_KEY_1E[1]);

ReadAFL();

fDDA("00",ICC_PK_Modulus_1024,ICC_PK_Exponent_1024,Signed_Dynamic_Data);

AC_GET=send('805A000002'+ATC+'08');
assertSW("9000");
if (AC_GET!=AC){
	error("Get Trans Prove error");
}

print("\n* ******************************");
print("\n* Transaction 3");
print("\n* ******************************");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

Record_Out_1E[2]=send('00B201F400');
assertSW("9000");
Record_Out_1E[1]=send('00B202F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_1E[1]=random(128);
UpdateCappDataCache("F0",Record_In_1E[1],CAPP_KEY_1E[1]);
Record_In_1E[2]=random(128);
UpdateCappDataCache("F0",Record_In_1E[2],CAPP_KEY_1E[1]);

send('805A000002'+ATC+'08');
assertSW("9406");

print("\n* ******************************");
print("\n* Transaction 4");
print("\n* ******************************");

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

if (Record_Out_1E[2]!=send('00B201F400')){
		error("Read SFI=0x1E Record01 error");
}
if (Record_Out_1E[1]!=send('00B202F400')){
		error("Read SFI=0x1E Record02 error");
}

print("\n* ******************************");
print("\n* Transaction 5");
print("\n* ******************************");
is_qPBOC=true;
CAPP_ID_DF60='02';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

send('00B201F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_1E[1]=random(128);
UpdateCappDataCache("F0",Record_In_1E[1],CAPP_KEY_1E[1]);

ReadAFL();

fDDA("00",ICC_PK_Modulus_1024,ICC_PK_Exponent_1024,Signed_Dynamic_Data);

AC_GET=send('805A000002'+ATC+'08');
assertSW("9000");
if (AC_GET!='0000000000000000'){
	error("Get Trans Prove error");
}

print("\n* ******************************");
print("\n* Transaction 6");
print("\n* ******************************");
is_qPBOC=true;
CAPP_ID_DF60='03';

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW("9000");

send('00B201F400');
assertSW("9000");

send_GPO_new();
assertSW("9000");

Record_In_1E[1]=random(128);
UpdateCappDataCache("F0",Record_In_1E[1],CAPP_KEY_1E[1]);

ReadAFL();

fDDA("00",ICC_PK_Modulus_1024,ICC_PK_Exponent_1024,Signed_Dynamic_Data);
