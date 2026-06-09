// KONA 232S INIT E2P SCRIPT v1.0 



reset();
select('a0');
auth();
var response = send('00CA9F7F2A');
var serial_number = response.substr(24, 8);
send('D004 02FE 06 0004' + serial_number);

reset();

// for 232S test
//include('KONA232S_02.12_PBOC/KONA232Sv1.0_ModeChange.js');
//include('KONA232S_Product_02.12_90C2.js');
//include('../../Images/pboc_reset.js');




