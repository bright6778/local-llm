include('_PERSO_CONF.js');

//select ISD
reset();
select('a0');
auth();

	
//remove instance
print('\n* Remove Instance');
send('80E40000094F07A000000333010200');
send('80E40000094F07A000000333010100');

print('\n* Install PBOC');
send('80E60C002206'+package_aid+'07'+applet_aid+'07'+instance_aid+'011007C905 0000 040000 00'); // Java
assertSW('9000');

