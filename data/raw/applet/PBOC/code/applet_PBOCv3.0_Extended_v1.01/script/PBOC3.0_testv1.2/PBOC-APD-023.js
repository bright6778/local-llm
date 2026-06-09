/*******************************************
 Test Name  : Read Other Application Data (APD 023)
 Objective  : Verify the acceptance of READ RECORD commands following GET
PROCESSING OPTIONS when the VSDC application is blocked.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");  
include("pboc_AppBlk.js");

print('\n* Test Case : APD 023');

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('6283');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");

UCOL_value = '';

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
		
	}

}
	include("PBOC-UTILITY-001-APPUNBLOCK.js");