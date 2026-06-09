//********************************************
// KONA27 v1.4 system patch lib script
//                      2009.06.24 - bgkim
//********************************************

var keyData = '4FBDC7BF007C6B0739E5BEE2AC94D8EB';


var randomData;   
var encryptedData;
var cdata;

function patch_read(addr, len) {
    var cdata;
    return send("B04E5AD005" + "01" + toHex(len) + addr);
    //cdata = send("A0C00000" + toHex(len));
    //return cdata;
}

function patch_write(addr, newData) {
    len = newData.length/2;
    send("B04E5AD0"+toHex(len+5) + "00" + toHex(len) + addr + newData);
}

c = new ShellScript();

//c.reset();
//c.select("a000000003");
c.send('807C8589');	// dummy commands
c.send('80C31068');
c.send('805234EB');
c.send('90BB10A8');
c.send('9020477C');
c.send('90C6FFC5');
c.send('A0ADA1C6');
c.send('A0705CC9');
c.print('');

c.print('***********************************');
c.print('  send GET RANDOM ');
c.print('***********************************');
randomData = c.send('A0A1469708');
c.assertSW('9000');
encryptedData = tdes_ecb(randomData, keyData);

c.print('***********************************');
c.print('  send verify host cryptogram ');
c.print('***********************************');
c.send('B0EE327E08' + encryptedData);
c.assertSW('9000');
c.print('');
