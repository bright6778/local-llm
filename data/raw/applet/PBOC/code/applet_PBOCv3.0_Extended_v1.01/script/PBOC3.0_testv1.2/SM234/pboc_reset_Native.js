include("_PBOC_CONF.js");

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
send('80E60C001D 06A00000033301 07A0000003330101 07'+AID+ '011002C9000000');
assertSW('9000');

print('\n* Select PBOC');
select(AID);

print('\n* External Authenticate and Initialize Update');
auth();
