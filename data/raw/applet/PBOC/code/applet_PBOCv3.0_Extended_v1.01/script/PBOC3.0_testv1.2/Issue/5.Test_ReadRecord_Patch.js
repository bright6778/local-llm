include("FunctionCheckAFL.js");
reset();

///////////////////////////////////////////////////////////
// TEST 1 /////////////////////////////////////////////////
///////////////////////////////////////////////////////////
print('\n===================================================');
print('* READ RECORD Patch Test 1 - Image_037_1152_sfi');
print('===================================================');

// perso check
include("2.pboc_common_perso_037_1152_sfi.js"); //image1~15
select_PBOC();

//read the record which store the 9F4B+9F5D
var record_9F4B_9F5D = send('00B2022C00');
var length_record = record_9F4B_9F5D.length/2;
print('the lenth is  '+ length_record);

if(length_record ==160) print('AOSL(9F5D) is needed to be showed in the record');	
else					error('Error - the applet has some issues ');	

//transaction check
reset();

print('\n*******************************************');
print('* Transaction');
print('*******************************************');

select('325041592E5359532E4444463031');
select_PBOC();
send_GPO();

checking_AFL_related_record(AFL);

//read the record which store the 9F4B+9F5D
var record_9F4B_9F5D = send('00B2022C00');
var length_record = record_9F4B_9F5D.length/2;
print('the lenth is  '+ length_record);

if(length_record ==160) print('AOSL(9F5D) is needed to be showed in the record');	
else					error('Error - the applet has some issues ');	


///////////////////////////////////////////////////////////
// TEST 2 /////////////////////////////////////////////////
///////////////////////////////////////////////////////////
print('\n===================================================');
print('* READ RECORD Patch Test 2 - Image_037_1152_sfi_no');
print('===================================================');

include("2.pboc_common_perso_037_1152_sfi_no.js");
select_PBOC();

//read the record which store the 9F4B
var record_9F4B_9F5D = send('00B2022c00');
var length_record = record_9F4B_9F5D.length/2;
print('the lenth is  '+ length_record);
if(length_record == 151)
	print('AOSL(9F5D) is not needed to be showed in the record');	
else
	error('the applet has some issues ');

//transaction
include("3.TestQPBOC.js");
	
///////////////////////////////////////////////////////////
// TEST 3 /////////////////////////////////////////////////
///////////////////////////////////////////////////////////
print('\n===================================================');
print('* READ RECORD Patch Test 3 - Image_037_1152');
print('===================================================');

include("2.pboc_common_perso_037_1152.js");
select_PBOC();

//read the record which store the 9F4B+9F5D
var record_9F4B_9F5D = send('00B2022c00');
var length_record = record_9F4B_9F5D.length/2;
print('the lenth is  '+ length_record);
if(length_record ==160)
	print('AOSL(9F5D) is needed to be showed in the record ');	
else
	error('the applet has some issues ');		

//transaction
include("3.TestQPBOC.js");

///////////////////////////////////////////////////////////
// TEST 4 /////////////////////////////////////////////////
///////////////////////////////////////////////////////////
print('\n===================================================');
print('* READ RECORD Patch Test 4 - Image_037_1152_no9F5D');
print('===================================================');

include("2.pboc_common_perso_037_1152_no9F5D.js");
select_PBOC();

//read the record which store the 9F4B
var record_9F4B_9F5D = send('00B2022c00');
var length_record = record_9F4B_9F5D.length/2;
print('the lenth is  '+ length_record);
if(length_record == 151)
    print('AOSL(9F5D) is not needed to be showed in the record ');	
else
	error('the applet has some issues ');	

//transaction
include("3.TestQPBOC.js");