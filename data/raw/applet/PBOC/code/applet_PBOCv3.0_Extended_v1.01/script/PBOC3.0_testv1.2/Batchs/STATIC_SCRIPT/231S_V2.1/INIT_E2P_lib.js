
var buf;

key = '31BF91D27AC657C742B6854C61BCE32E';

function patch_auth(read) {
    reset();
    send("DA 28 6A 73");
    send("93 A3 88 6C");
    send("FE 1D 19 EB");
    send("62 03 7C 95");
    send("41 7D AA 48 ");
    send("C5 1A BE 1C");
    send("A1 E5 ED 2C");
    send("68 24 E8 42 ");
    cardRandom = send("9E 0C 67 73 08");
    send("08 A6 20 28 09" + (read ? "01" : "00") +tdes_cbc(cardRandom.substring(0,16), key));
}


function patch_read(addr, len) {
    buf = send("DCAA112F04" + toHex(len) + addr);
    return buf;
}

function patch_load(addr, newData) {
    len = newData.length/2;
    send("DCAA112F"+toHex(len+4) + toHex(len) + addr + newData);
}