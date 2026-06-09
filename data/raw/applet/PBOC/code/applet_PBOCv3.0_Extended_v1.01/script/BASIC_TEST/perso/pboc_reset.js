include('_PERSO_CONF.js');

//select ISD
reset();
select('a0');

print('\n[External Authenticate and Initialize Update]');
auth();

	
//remove instance
send('80E40000094F07A000000333010200');
send('80E40000094F07A000000333010100');

print('\n[Install PBOC]');
send('80E60C002206'+package_aid+'07'+applet_aid+'07'+AID+'011007C905 0000 000000 00'); // Native
assertSW('9000');


print('\n[Select PBOC]');
select(AID);
print('\n[External Authenticate and Initialize Update]');
auth();
