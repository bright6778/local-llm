include('_PBOC_COMMON.js'); 

reset();

send_Select();

DOL_DATA['9F66'] = 'F6000000';
DOL_DATA['DF69'] = '00';

send_GPO();


ReadAFL();

send_InternalAuth();
//pause();
send_GenAC('40', CDOL1); // 1st GenAC with CDA

