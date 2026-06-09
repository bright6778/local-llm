/*******************************************
 Test Name  : WrongPDOLwithCLPBOCpath
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.008.00.00
 Card Conf  : N/A
 Condition  : LT sends a SELECT command on PPSE
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-CTH-002');

print('\n* Power on the Card(ATR)');
reset();

Terminal_Country_Code = Terminal_Country_Code_Diff;
Transaction_Currency_Code = Transaction_Currency_Code_Diff;
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_7);

print("\n* Case 01: tag 83 length not consistent with the expected PDOL");
print("\n* Transaction 1");
select_PBOC();
assertSW('9000');
if(PDOL =="") error("The template 'A5' should include tag '9F38'(PDOL)");

response = send_GPO("8300");
if(response != '') error("The GPO shall be rejected");


print("\n* Case 02: without tag 83 (and length)");
print("\n* Transaction 1");
select_PBOC();
assertSW('9000');
if(PDOL =="") error("The template 'A5' should include tag '9F38'(PDOL)");

var data;
if(CVN == '01'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Amount_Other + Terminal_Country_Code + TVR + Transaction_Currency_Code + Transaction_Date + Transaction_Type + Unpredictable_Number;
}
else if(CVN == '17'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Unpredictable_Number + Transaction_Currency_Code;
}
response = send_GPO(data);
if(response != '') error("The GPO shall be rejected");


print("\n* Case 03: tag 83 with a wrong length (not consistent with Lc)");
print("\n* Transaction 1");
select_PBOC();
assertSW('9000');
if(PDOL =="") error("The template 'A5' should include tag '9F38'(PDOL)");

var data;
if(CVN == '01'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Amount_Other + Terminal_Country_Code + TVR + Transaction_Currency_Code + Transaction_Date + Transaction_Type + Unpredictable_Number;
	data = '83' + toHex(data.length/2 + 1) + data;
}
else if(CVN == '11'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Unpredictable_Number + Transaction_Currency_Code;
	data = '83' + toHex(data.length/2 + 1) + data;
}
response = send_GPO(data);
if(response != '') error("The GPO shall be rejected");


print("\n* Case 04: PDOL data but not formatted into a data element 83");
print("\n* Transaction 1");
select_PBOC();
assertSW('9000');
if(PDOL =="") error("The template 'A5' should include tag '9F38'(PDOL)");

var data;
if(CVN == '01'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Amount_Other + Terminal_Country_Code + TVR + Transaction_Currency_Code + Transaction_Date + Transaction_Type + Unpredictable_Number;
	data = '73' + toHex(data.length/2 + 1) + data;
}
else if(CVN == '17'){
	data = Terminal_Transaction_Qualifiers + Amount_Authorised + Unpredictable_Number + Transaction_Currency_Code;
	data = '73' + toHex(data.length/2 + 1) + data;
}
response = send_GPO(data);
if(response != '') error("The GPO shall be rejected");

