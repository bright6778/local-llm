include('_PBOC_COMMON.js'); 

reset();

send_Select();
assertSW('9000');

DOL_DATA['9F66'] = 'F6000000';
DOL_DATA['DF69'] = '01';

send_GPO();
assertSW('9000');


ReadAFL();

send_InternalAuth();
assertSW('9000');
//pause();
send_GenAC('40', CDOL1); // 1st GenAC with CDA
assertSW('9000');

