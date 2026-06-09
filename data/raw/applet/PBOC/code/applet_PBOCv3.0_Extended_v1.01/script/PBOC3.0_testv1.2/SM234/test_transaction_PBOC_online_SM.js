include('_PBOC_COMMON.js'); 

reset();

send_Select();

DOL_DATA['9F66'] = 'F6000000';
DOL_DATA['DF69'] = '01';

send_GPO();


ReadAFL();

send_InternalAuth();

send_GenAC('80', CDOL1); // 1st GenAC
assertSW('9000');

send_ExternalAuth('3030');
assertSW('9000');

send_GenAC('40', CDOL2); // 2nd GenAC 
assertSW('9000');

send_PinChange(null, '1234');
