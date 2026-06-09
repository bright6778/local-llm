/*******************************************
 Test Name  : Read Other Application Data (APD 024)
 Objective  :Verify Card rejects the READ RECORD command when the Card is blocked.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : APD 024');

// get AFL before card block
print('\n* Power on the Card(ATR)');
reset();
select(pse_aid);
select_PBOC();
send_GPO(TEST_PDOL_DATA);

var AFL_temp = AFL;

// test after card block
include("pboc_CardBlockTest.js");

print('\n* Power on the Card(ATR)');
reset();
select(pse_aid);
assertSW('6A81');
send_GPO(TEST_PDOL_DATA);
assertSW('6A81');

print ("** Read Record **");
UCOL_value = '';

 for(i = 0 ; i < AFL_temp.length ; i += 8)
{
	recordRange = AFL_temp.substring(i, i + 8);
	SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
	startRecordNumber = parseInt(recordRange.substring(2,4), 16);
	endRecordNumber = parseInt(recordRange.substring(4,6), 16);

	print("READ RECORD");
	for(j = startRecordNumber; j <= endRecordNumber; j++)
	{
		print("SFI : " + SFI + "  " + "Record Number : " + j);
		recordData = send_ReadRecord(SFI, j);
		assertSW("6A81");	
	}
}
		