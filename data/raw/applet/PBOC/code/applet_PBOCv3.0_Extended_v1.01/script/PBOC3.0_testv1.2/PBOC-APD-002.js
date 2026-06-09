/*******************************************
 Test Name  : Read Other Application Data (APD 002)
 Objective  : Verify the status word returned in all responses on READ RECORD
commands following GET PROCESSING OPTIONS
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : APD002');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");


 for(i = 0 ; i < AFL.length ; i += 8)
{
	recordRange = AFL.substring(i, i + 8);
	SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
	startRecordNumber = parseInt(recordRange.substring(2,4), 16);
	endRecordNumber = parseInt(recordRange.substring(4,6), 16);

	print("READ RECORD");
	for(j = startRecordNumber; j <= endRecordNumber; j++)
	{
		print("SFI : " + SFI + "  " + "Record Number : " + j);
		recordData = send_ReadRecord(SFI, j);
		assertSW("9000");

		recordData = lookup_BER_TLV(recordData, "70", RETURN_LENGTH);
		if (recordData > 252)  error ("Invaild Record Template");

			}
}
