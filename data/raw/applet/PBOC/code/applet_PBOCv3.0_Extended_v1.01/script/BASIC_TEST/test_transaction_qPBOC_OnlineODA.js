include('_PBOC_COMMON.js');

// fDDA00
reset();

send('00A404000E325041592E5359532E444446303100');
//assertSW('9000');

send_select();
assertSW('9000');

DOL_DATA['9F66'] = '37000000';
send_gpo();
assertSW('9000');

assertEquals(CARD_DATA['9F10'].substring(8, 10), 'A0'); // TC

read_afl();

parse_SDA();
parse_fDDA();

// fDDA01
reset();

send('00A404000E325041592E5359532E444446303100');
//assertSW('9000');

send_select();
assertSW('9000');

DOL_DATA['9F66'] = '37000080';
send_gpo();
assertSW('9000');

assertEquals(CARD_DATA['9F10'].substring(8, 10), 'A0'); // TC

read_afl();

parse_SDA();
parse_fDDA();

