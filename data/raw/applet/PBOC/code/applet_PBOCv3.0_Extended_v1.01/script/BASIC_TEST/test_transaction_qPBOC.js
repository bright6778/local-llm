include('_PBOC_COMMON.js');

print('**********************************************************');
print('**********************************************************');
print('*                       qPBOC');
print('**********************************************************');
print('**********************************************************\n');


print('**********************************************************');
print('*               Offline Transaction');
print('**********************************************************');

// fDDA00
reset();

send('00A404000E325041592E5359532E444446303100');
//assertSW('9000');

send_select();
assertSW('9000');

DOL_DATA['9F66'] = '28000000';
send_gpo();
assertSW('9000');

assertEquals(CARD_DATA['9F10'].substring(8, 10), '90'); // TC

read_afl();

parse_fDDA();


// fDDA01
reset();

send('00A404000E325041592E5359532E444446303100');
//assertSW('9000');

send_select();
assertSW('9000');

DOL_DATA['9F66'] = '28000080';
send_gpo();
assertSW('9000');

assertEquals(CARD_DATA['9F10'].substring(8, 10), '90'); // TC

read_afl();

parse_fDDA();

print('**********************************************************');
print('*               Online Transaction');
print('**********************************************************');
reset();

send('00A404000E325041592E5359532E444446303100');
//assertSW('9000');

send_select();
assertSW('9000');

DOL_DATA['9F66'] = '30800080';
send_gpo();

assertEquals(CARD_DATA['9F10'].substring(8, 10), 'A0'); // ARQC
