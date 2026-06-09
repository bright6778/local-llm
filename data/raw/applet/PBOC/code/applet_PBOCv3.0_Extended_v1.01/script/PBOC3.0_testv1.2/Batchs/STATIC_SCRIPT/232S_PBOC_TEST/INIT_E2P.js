// KONA 232S INIT E2P SCRIPT v1.0 

script = new ShellScript();

script.reset();
script.select('a0');
script.auth();
var response = script.send('00CA9F7F2A');
var serial_number = response.substr(24, 8);
script.send('D004 02FE 06 0004' + serial_number);

reset();