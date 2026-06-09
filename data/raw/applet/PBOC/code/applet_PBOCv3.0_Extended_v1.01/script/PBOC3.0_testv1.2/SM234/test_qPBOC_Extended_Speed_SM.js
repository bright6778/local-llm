include('_PBOC_COMMON.js');
reset();
send('00A404000E325041592E5359532E444446303100');
send('00A4040007A000000333010100');
ReadCappDataWithRandom('C8',Record_In_19[1].substr(0,4));
assertSW('9000');
data = send('80A800002583230120100080000000000000000000000000015600000000000156000125001234567801');
ATC = data.substring(40, 44);
Record_In_19[1]=Record_In_19[1].substr(0,4)+'35'+random(53);
UpdateCappDataCache('C8',Record_In_19[1],CAPP_KEY_19[1]);
send('00B2031400');
send('00B2041400');
send('00B2051400');
send('00B2031C00');

