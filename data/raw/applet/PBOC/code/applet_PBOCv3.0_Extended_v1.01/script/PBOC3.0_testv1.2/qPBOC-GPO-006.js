/*******************************************
 Test Name  : CheckAFL
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CD.018.00.00
 Card Conf  : N/A
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-GPO-006');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();

select_PBOC();
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);

response = send_GPO(CVN);
assertSW('9000');

for(i = 0 ; i < AFL.length ; i += 8)
{
	recordRange = AFL.substring(i, i + 8);
	SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
	startRecordNumber = parseInt(recordRange.substring(2,4), 16);
	endRecordNumber = parseInt(recordRange.substring(4,6), 16); 
	authRecordNumber = parseInt(recordRange.substring(6,8), 16); 

	if(SFI > 30) 
			error("The higher SFI number should be less than 31.");

	BYTE_1 = parseInt(recordRange.substring(0,2), 16);
		
	if((BYTE_1 & BIT_MASK_3) != 0 || (BYTE_1 & BIT_MASK_2) != 0 || (BYTE_1 & BIT_MASK_1) != 0)
		error("The Byte 1 three least significant bits shall be set to zero.");

	if(startRecordNumber == 0 || endRecordNumber == 0)
		error("The Byte 2 and 3 shall not be zero.");

	if(startRecordNumber > endRecordNumber)
		error("The Byte 2 shall be less than or equal to byte 3.");

	if(authRecordNumber < 0 || authRecordNumber > (endRecordNumber - startRecordNumber + 1))
		error("The Byte 4 shall range from zero to the value of [[Byte3 - Byte2]+1].");
}
print("\n* AFL length : " + AFL.length + '& for each AFL block(4 bytes) OK!!');

