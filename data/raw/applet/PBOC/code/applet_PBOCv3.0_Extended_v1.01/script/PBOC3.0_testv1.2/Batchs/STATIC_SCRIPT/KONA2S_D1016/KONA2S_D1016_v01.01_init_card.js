// KONA 232S INIT E2P SCRIPT v1.0 

script = new ShellScript();

script.reset();
script.select('a0');
script.auth();
script.send('D00402FE06010400000000');
script.assertSW('9000');

reset();