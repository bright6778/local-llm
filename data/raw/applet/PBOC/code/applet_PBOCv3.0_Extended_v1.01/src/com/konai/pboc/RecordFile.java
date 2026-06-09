

package com.konai.pboc;

import javacard.framework.JCSystem;
import javacard.framework.Util;
import javacard.security.DESKey;

public abstract class RecordFile  {
    static short[] currentRecord;    // current record pointer
    static final byte TYPE_VARIABLE     = 0x01;
    static final byte TYPE_CYCLIC       = 0x02;
    byte[] initializeKeyData; 
	byte type;
    short maxRecordNumber; 
    
    byte[] getInitializeKeyData() {
		return initializeKeyData;
	}
   
    short getMaxRecordNumber() {
		return maxRecordNumber;
	}
   
    void setInitializeKeyData(byte[] src, short off_src){
    	   Util.arrayCopy(src,off_src, initializeKeyData, (short)0, (short)16); 
    }
 
  

  
 

	RecordFile(){
		
		 initializeKeyData = new byte[16];
    	   if (currentRecord == null) {
           	currentRecord = JCSystem.makeTransientShortArray((short)1, JCSystem.CLEAR_ON_DESELECT);
           }
    }
    boolean isCyclic(){
    	if(type == RecordFile.TYPE_VARIABLE){
    		return false;
    	}else{
    		return true;
    	}
    	
    }
    
    static short getCurrentRecord() {
		return currentRecord[0];
	}

	static void setCurrentRecord(short recordNumber) {
		RecordFile.currentRecord[0] = recordNumber;
    }
    
    abstract void append(byte[] src, short srcOff, short length);
    abstract short read(byte number, byte[] dest, short destOff, short length);
    abstract void update(byte number, byte[] src, short srcOff, short length);
    abstract byte getFirstRecord();
    abstract byte getLastRecord();
    abstract byte getNextRecord();
    abstract byte getPreviousRecord();
    abstract short getRecordLength(byte number);
    abstract short searchReccordByID(short id,boolean isfisrt,short length);
    abstract void setKeyData(short num,DESKey key);
}