/*
 * @Date : Apr 10, 2012
 * @auther: CYF
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.konai.pboc;

import javacard.framework.ISO7816;
import javacard.framework.ISOException;
import javacard.framework.JCSystem;
import javacard.framework.Util;
import javacard.security.DESKey;

public class LinearVariableFile extends RecordFile {
	 
//	   byte[] initializeKeyData; 
//		private static final byte RECORD_EXIST = (byte)0x01;
//		private static final byte RECORD_OUT_BOUND = (byte)0x02;
//		private static final byte RECORD_IN_BOUND_NO_EXIST = (byte)0x03;
//		private static final byte RECORD_WRONG_LENGTH = (byte)0x04;
//		private static final byte RECORD_UNKNOWN_STATE = (byte)0x05;
	  
	    private short maxRecordLength;
		private byte[] recordLengthList;
		public byte[] getRecordLengthList() {
			return recordLengthList;
		}

		protected byte[] body;
		public byte[] getBody() {
			return body;
		}

		protected byte[] keys;

		private short firstRecordIndex;
	
		
		LinearVariableFile(byte[] apduBuffer, short offset) {
			 
			super();
			
		    //super(apduBuffer);
		    this.type =RecordFile.TYPE_VARIABLE;
		   
		    maxRecordNumber = (short)(10);
		    short bodyLength = Util.getShort(apduBuffer,(short)(offset+3));
		    
		    maxRecordLength = (short)(apduBuffer[(short)(offset +2)] & 0x00FF);
		    recordLengthList = new byte[maxRecordNumber];
		    if(bodyLength==0){
		    	body = new byte[(short)(maxRecordLength*maxRecordNumber)];
		    }else{
		    	body = new byte[bodyLength];
		    }
	     
	        keys=new byte[(short)(maxRecordNumber*16)];
	        
	      
	       // Util.arrayCopy(apduBuffer,(short)(offset +4), initializeKeyData, (short)0, (short)16);
	       
		}
	
		/**
		 * append record
		 */
		void append(byte[] src, short srcOff, short length) {
		    if (recordLengthList[(short)(maxRecordNumber - 1)] != 0) {
		        ISOException.throwIt(ISO7816.SW_FILE_FULL);
		    }
		    
		    if((short)(length-16)>maxRecordLength){
		        ISOException.throwIt(ISO7816.SW_WRONG_DATA);
		    }
		    short recordNumber = 0;
		    short bodyOffset = 0;
	        for (; recordLengthList[recordNumber] != 0; recordNumber++) {
	            bodyOffset += (short)(recordLengthList[recordNumber] & 0x00FF);
	        }
	        
	        length &= 0x00FF;
	        if ((short)(bodyOffset + length-16) > body.length) {
	            ISOException.throwIt(ISO7816.SW_FILE_FULL);
	        }
	        
	        JCSystem.beginTransaction();
	        Util.arrayCopy(src, (short)(srcOff+16), body, bodyOffset, (short)(length-16));
	        recordLengthList[recordNumber] = (byte)((length-16)&0xFF);
	        Util.arrayCopy(src, srcOff, keys,(short)(recordNumber*16) , (short)16);
	        
	        JCSystem.commitTransaction();
	        
	       
	       setCurrentRecord(++recordNumber);
	    }

		/**
		 * read record
		 */
	    short read(byte number, byte[] dest, short destOff, short length) {
//	    	if (number == 0x00) {
//	        	number = (byte)getCurrentRecord();
//	        }
	        number--;
	        if (number >= maxRecordNumber || recordLengthList[number] == 0x00) {
				ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
	        }
	        
	        short recordLength = (short)(recordLengthList[number] & 0x00FF);
	        length &= 0x00FF;
	     /*   if (length > recordLength) {
	            ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
	        }*/
	        short offset = 0;
	        for (short i = 0; i < number; i++) {
	            offset += (short)(recordLengthList[i] & 0x00FF);
	        }
	        
	        Util.arrayCopyNonAtomic(body, offset, dest, destOff, recordLength);
	        
	        setCurrentRecord(++number);
	        
	        return recordLength;
		}
	    
	    /**
	     * update record
	     */
		void update(byte number, byte[] src, short srcOff, short length) {
			if (number == 0x00) {
	        	//number = (byte)getCurrentRecord();
	        }
	    	number--;
	        if (number >= maxRecordNumber || recordLengthList[number] == 0x00) {
	            ISOException.throwIt(ISO7816.SW_RECORD_NOT_FOUND);
	        }
	        
	        short recordLength = (short)(recordLengthList[number] & 0x00FF);
	        length &= 0x00FF;
	        if (length != recordLength) {
	            // FIXME : SW for this error case is not defined in spec. 
	            ISOException.throwIt(ISO7816.SW_INCORRECT_P1P2);
	        }
	        
	        short offset = 0;
	        for (short i = 0; i < number; i++) {
	            offset += (short)(recordLengthList[i] & 0x00FF);
	        }
	        
	      
	        Util.arrayCopy(src, srcOff, body, offset, recordLength);
	        
	        
	        //setCurrentRecord(++number);
		}

/*	    byte getFirstRecord() {
//	        return (byte)0x01;
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getLastRecord() {
//	        short i;
//	        for (i = 0; i < NUMBER_OF_RECORD; i++) {
//	            if (recordLengthList[i] == (byte)0x00) {
//	                break;
//	            }
//	        }
	//
//	        return (i == NUMBER_OF_RECORD) ? (byte)i : (byte)(i + 1);
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getNextRecord() {
//	        if (currentRecord == NUMBER_OF_RECORD) {
//	            return (byte)currentRecord;
//	        }
	//
//	        return (byte)(currentRecord + 1);
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getPreviousRecord() {
//	        if (currentRecord == (byte)0x01) {
//	            return (byte)currentRecord;
//	        }
	//
//	        return (byte)(currentRecord - 1);
	    	return (byte)getCurrentRecord();
	    }*/
	    
	    short getRecordLength(byte number) {
	        if (number == (byte)0x00) {
	            return (short)(recordLengthList[(short)(getCurrentRecord() - 1)] & 0x00FF);
	        }
	        
	        return (short)(recordLengthList[--number] & 0x00FF);
	    }

	
		byte getFirstRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

	
		byte getLastRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

	
		byte getNextRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

		
		byte getPreviousRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}
		short searchReccordByID(short id, boolean isFisrt,short len) {
		
		    
		    short recordIndex = 0;
		    short bodyOffset = 0;
		    short id_temp = 0;
		    boolean isFirstFound = false;
		    short length_record=0;
		    
		
	        for (;(recordIndex<maxRecordNumber&&recordLengthList[recordIndex] != 0); recordIndex++) {
	        	
	        	id_temp=Util.getShort(body,bodyOffset);
	        	length_record = (short)(body[(short)(bodyOffset+2)]&0xFF);
	        	if(id==id_temp){
	        		if(len!=0){
	        			if(length_record!=(short)(len-3)){
	        				 ISOException.throwIt(ISO7816.SW_FILE_FULL);
	        			}
	        		}
	        		if(isFisrt){
	        			return ++recordIndex;
	        		}else{
	        			if(isFirstFound){
	        				return ++recordIndex;

	        			}else{
	        				isFirstFound=true;
	        				
	        			}
	        		}
	        	}
	        	bodyOffset += (short)(recordLengthList[recordIndex] & 0x00FF);
	        }
	        
	     
	        
	        
	        
			return 0;
		}

		void setKeyData(short num,DESKey key) {
			// TODO 자동 생성된 메소드 스텁
			key.setKey( keys,(short)((num-1)*16));
		}
}
