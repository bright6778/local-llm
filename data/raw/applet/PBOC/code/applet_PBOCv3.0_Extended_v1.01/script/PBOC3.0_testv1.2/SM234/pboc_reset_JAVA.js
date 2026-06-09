include("_PBOC_CONF.js");

var package_aid = 'A00000033301';
var applet_aid = 'A0000003330101';
var instance_aid = 'A0000003330101';

//select ISD
reset();
select('a0');
auth();

	
//remove instance
print('\n* Remove Instance');
send('80E40000104F0E325041592E535953 2E444446303100');
send('80E40000104F0E315041592E535953 2E444446303100');
send('80E40000094F07A000000333010200');
send('80E40000094F07A000000333010100');

print('\n* Install PBOC');
send('80E60C002206'+package_aid+'07'+applet_aid+'07'+instance_aid+'011007C905 0000 040000 00'); // Java
assertSW('9000');

print('\n* Select PBOC');
select(AID);

print('\n* External Authenticate and Initialize Update');
auth();
