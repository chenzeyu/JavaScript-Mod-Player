var context = new webkitAudioContext();
function ModReader(mod) {
 /* ModPeriodTable[ft][n] = the period to use for note number n at finetune value ft.
       Finetune values are in twos-complement, i.e. [0,1,2,3,4,5,6,7,-8,-7,-6,-5,-4,-3,-2,-1]
       The first table is used to generate a reverse lookup table, to find out the note number
       for a period given in the MOD file.
*/
    var ModPeriodTable = [
	[1712, 1616, 1524, 1440, 1356, 1280, 1208, 1140, 1076, 1016, 960 , 906,
	 856 , 808 , 762 , 720 , 678 , 640 , 604 , 570 , 538 , 508 , 480 , 453,
	 428 , 404 , 381 , 360 , 339 , 320 , 302 , 285 , 269 , 254 , 240 , 226,
	 214 , 202 , 190 , 180 , 170 , 160 , 151 , 143 , 135 , 127 , 120 , 113,
	 107 , 101 , 95  , 90  , 85  , 80  , 75  , 71  , 67  , 63  , 60  , 56 ],
	[1700, 1604, 1514, 1430, 1348, 1274, 1202, 1134, 1070, 1010, 954 , 900,
	 850 , 802 , 757 , 715 , 674 , 637 , 601 , 567 , 535 , 505 , 477 , 450,
	 425 , 401 , 379 , 357 , 337 , 318 , 300 , 284 , 268 , 253 , 239 , 225,
	 213 , 201 , 189 , 179 , 169 , 159 , 150 , 142 , 134 , 126 , 119 , 113,
	 106 , 100 , 94  , 89  , 84  , 79  , 75  , 71  , 67  , 63  , 59  , 56 ],
	[1688, 1592, 1504, 1418, 1340, 1264, 1194, 1126, 1064, 1004, 948 , 894,
	 844 , 796 , 752 , 709 , 670 , 632 , 597 , 563 , 532 , 502 , 474 , 447,
	 422 , 398 , 376 , 355 , 335 , 316 , 298 , 282 , 266 , 251 , 237 , 224,
	 211 , 199 , 188 , 177 , 167 , 158 , 149 , 141 , 133 , 125 , 118 , 112,
	 105 , 99  , 94  , 88  , 83  , 79  , 74  , 70  , 66  , 62  , 59  , 56 ],
	[1676, 1582, 1492, 1408, 1330, 1256, 1184, 1118, 1056, 996 , 940 , 888,
	 838 , 791 , 746 , 704 , 665 , 628 , 592 , 559 , 528 , 498 , 470 , 444,
	 419 , 395 , 373 , 352 , 332 , 314 , 296 , 280 , 264 , 249 , 235 , 222,
	 209 , 198 , 187 , 176 , 166 , 157 , 148 , 140 , 132 , 125 , 118 , 111,
	 104 , 99  , 93  , 88  , 83  , 78  , 74  , 70  , 66  , 62  , 59  , 55 ],
	[1664, 1570, 1482, 1398, 1320, 1246, 1176, 1110, 1048, 990 , 934 , 882,
	 832 , 785 , 741 , 699 , 660 , 623 , 588 , 555 , 524 , 495 , 467 , 441,
	 416 , 392 , 370 , 350 , 330 , 312 , 294 , 278 , 262 , 247 , 233 , 220,
	 208 , 196 , 185 , 175 , 165 , 156 , 147 , 139 , 131 , 124 , 117 , 110,
	 104 , 98  , 92  , 87  , 82  , 78  , 73  , 69  , 65  , 62  , 58  , 55 ],
	[1652, 1558, 1472, 1388, 1310, 1238, 1168, 1102, 1040, 982 , 926 , 874,
	 826 , 779 , 736 , 694 , 655 , 619 , 584 , 551 , 520 , 491 , 463 , 437,
	 413 , 390 , 368 , 347 , 328 , 309 , 292 , 276 , 260 , 245 , 232 , 219,
	 206 , 195 , 184 , 174 , 164 , 155 , 146 , 138 , 130 , 123 , 116 , 109,
	 103 , 97  , 92  , 87  , 82  , 77  , 73  , 69  , 65  , 61  , 58  , 54 ],
	[1640, 1548, 1460, 1378, 1302, 1228, 1160, 1094, 1032, 974 , 920 , 868,
	 820 , 774 , 730 , 689 , 651 , 614 , 580 , 547 , 516 , 487 , 460 , 434,
	 410 , 387 , 365 , 345 , 325 , 307 , 290 , 274 , 258 , 244 , 230 , 217,
	 205 , 193 , 183 , 172 , 163 , 154 , 145 , 137 , 129 , 122 , 115 , 109,
	 102 , 96  , 91  , 86  , 81  , 77  , 72  , 68  , 64  , 61  , 57  , 54 ],
	[1628, 1536, 1450, 1368, 1292, 1220, 1150, 1086, 1026, 968 , 914 , 862,
	 814 , 768 , 725 , 684 , 646 , 610 , 575 , 543 , 513 , 484 , 457 , 431,
	 407 , 384 , 363 , 342 , 323 , 305 , 288 , 272 , 256 , 242 , 228 , 216,
	 204 , 192 , 181 , 171 , 161 , 152 , 144 , 136 , 128 , 121 , 114 , 108,
	 102 , 96  , 90  , 85  , 80  , 76  , 72  , 68  , 64  , 60  , 57  , 54 ],
	[1814, 1712, 1616, 1524, 1440, 1356, 1280, 1208, 1140, 1076, 1016, 960,
	 907 , 856 , 808 , 762 , 720 , 678 , 640 , 604 , 570 , 538 , 508 , 480,
	 453 , 428 , 404 , 381 , 360 , 339 , 320 , 302 , 285 , 269 , 254 , 240,
	 226 , 214 , 202 , 190 , 180 , 170 , 160 , 151 , 143 , 135 , 127 , 120,
	 113 , 107 , 101 , 95  , 90  , 85  , 80  , 75  , 71  , 67  , 63  , 60 ],
	[1800, 1700, 1604, 1514, 1430, 1350, 1272, 1202, 1134, 1070, 1010, 954,
	 900 , 850 , 802 , 757 , 715 , 675 , 636 , 601 , 567 , 535 , 505 , 477,
	 450 , 425 , 401 , 379 , 357 , 337 , 318 , 300 , 284 , 268 , 253 , 238,
	 225 , 212 , 200 , 189 , 179 , 169 , 159 , 150 , 142 , 134 , 126 , 119,
	 112 , 106 , 100 , 94  , 89  , 84  , 79  , 75  , 71  , 67  , 63  , 59 ],
	[1788, 1688, 1592, 1504, 1418, 1340, 1264, 1194, 1126, 1064, 1004, 948,
	 894 , 844 , 796 , 752 , 709 , 670 , 632 , 597 , 563 , 532 , 502 , 474,
	 447 , 422 , 398 , 376 , 355 , 335 , 316 , 298 , 282 , 266 , 251 , 237,
	 223 , 211 , 199 , 188 , 177 , 167 , 158 , 149 , 141 , 133 , 125 , 118,
	 111 , 105 , 99  , 94  , 88  , 83  , 79  , 74  , 70  , 66  , 62  , 59 ],
	[1774, 1676, 1582, 1492, 1408, 1330, 1256, 1184, 1118, 1056, 996 , 940,
	 887 , 838 , 791 , 746 , 704 , 665 , 628 , 592 , 559 , 528 , 498 , 470,
	 444 , 419 , 395 , 373 , 352 , 332 , 314 , 296 , 280 , 264 , 249 , 235,
	 222 , 209 , 198 , 187 , 176 , 166 , 157 , 148 , 140 , 132 , 125 , 118,
	 111 , 104 , 99  , 93  , 88  , 83  , 78  , 74  , 70  , 66  , 62  , 59 ],
	[1762, 1664, 1570, 1482, 1398, 1320, 1246, 1176, 1110, 1048, 988 , 934,
	 881 , 832 , 785 , 741 , 699 , 660 , 623 , 588 , 555 , 524 , 494 , 467,
	 441 , 416 , 392 , 370 , 350 , 330 , 312 , 294 , 278 , 262 , 247 , 233,
	 220 , 208 , 196 , 185 , 175 , 165 , 156 , 147 , 139 , 131 , 123 , 117,
	 110 , 104 , 98  , 92  , 87  , 82  , 78  , 73  , 69  , 65  , 61  , 58 ],
	[1750, 1652, 1558, 1472, 1388, 1310, 1238, 1168, 1102, 1040, 982 , 926,
	 875 , 826 , 779 , 736 , 694 , 655 , 619 , 584 , 551 , 520 , 491 , 463,
	 437 , 413 , 390 , 368 , 347 , 328 , 309 , 292 , 276 , 260 , 245 , 232,
	 219 , 206 , 195 , 184 , 174 , 164 , 155 , 146 , 138 , 130 , 123 , 116,
	 109 , 103 , 97  , 92  , 87  , 82  , 77  , 73  , 69  , 65  , 61  , 58 ],
	[1736, 1640, 1548, 1460, 1378, 1302, 1228, 1160, 1094, 1032, 974 , 920,
	 868 , 820 , 774 , 730 , 689 , 651 , 614 , 580 , 547 , 516 , 487 , 460,
	 434 , 410 , 387 , 365 , 345 , 325 , 307 , 290 , 274 , 258 , 244 , 230,
	 217 , 205 , 193 , 183 , 172 , 163 , 154 , 145 , 137 , 129 , 122 , 115,
	 108 , 102 , 96  , 91  , 86  , 81  , 77  , 72  , 68  , 64  , 61  , 57 ],
	[1724, 1628, 1536, 1450, 1368, 1292, 1220, 1150, 1086, 1026, 968 , 914,
	 862 , 814 , 768 , 725 , 684 , 646 , 610 , 575 , 543 , 513 , 484 , 457,
	 431 , 407 , 384 , 363 , 342 , 323 , 305 , 288 , 272 , 256 , 242 , 228,
	 216 , 203 , 192 , 181 , 171 , 161 , 152 , 144 , 136 , 128 , 121 , 114,
	 108 , 101 , 96  , 90  , 85  , 80  , 76  , 72  , 68  , 64  , 60  , 57 ]];

    var ModPeriodToNoteNumber = {};
    var context = new webkitAudioContext();
    for (var i = 0; i < ModPeriodTable[0].length; i++) {
        ModPeriodToNoteNumber[ModPeriodTable[0][i]] = i;
    }
    this.sampleNum = 31; //assuming there are 31 samples
    this.channelNum = 4; //assuming there are 4 channels
    this.samples = []; //31 samples
    this.audios = []; //31 samples' audiobuffer

    /* load modfile by using XMLHttpRequest to an arraybuffer*/
    function loadarraybuffer(url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.responseType = "arraybuffer";
        req.onerror = function (e) {
            console.error(e);
        };
        req.send();

        return req.response;
    }

    //load modfile to m_buffer//
   // if(mod instanceof ArrayBuffer){
   
    if(typeof mod=="string"){
    this.m_buffer = loadarraybuffer(mod);
    }
    else{
	this.m_buffer = mod;
    }

    var viewData = new DataView(this.m_buffer);
    /* get the all the samples 
   attributes: length:length of the sample, divided by rate(e.g. 44100) will get the time(second)
               repaetOffset: the offset of the start of repeat portion
               repleathLenth: length of the repeat portion.		*/
    for (var i = 0; i < 31; i++) {
        this.samples[i] = {
            length: viewData.getInt16(30 * i + 42) * 2,
            finetune: viewData.getInt8(30 * i + 44),
            volume: viewData.getInt8(30 * i + 45),
            repeatOffset: viewData.getInt16(30 * i + 46) * 2,
            repeatLength: viewData.getInt16(30 * i + 48) * 2,
        }
//	document.write(this.samples[i].length+"        ");
    }


    this.OrderListLength = viewData.getInt8(950); //length of orderlist
    this.OrderList = []; //orderlist : each value represents a pattern 
    this.PatternNum = 0; //number of patterns we load
    /* write OrderList, get PatternNum*/
    for (var i = 0; i < 128; i++) {
        this.OrderList[i] = viewData.getInt8(952 + i);
        if (this.OrderList[i] > this.PatternNum) {
            this.PatternNum = this.OrderList[i];
        }

    }
    var channelNumTable = {
		'TDZ1': 1, '1CHN': 1, 'TDZ2': 2, '2CHN': 2, 'TDZ3': 3, '3CHN': 3,
		'M.K.': 4, 'FLT4': 4, 'M!K!': 4, '4CHN': 4, 'TDZ4': 4, '5CHN': 5, 'TDZ5': 5,
		'6CHN': 6, 'TDZ6': 6, '7CHN': 7, 'TDZ7': 7, '8CHN': 8, 'TDZ8': 8, 'OCTA': 8, 'CD81': 8,
		'9CHN': 9, 'TDZ9': 9,
		'10CH': 10, '11CH': 11, '12CH': 12, '13CH': 13, '14CH': 14, '15CH': 15, '16CH': 16, '17CH': 17,
		'18CH': 18, '19CH': 19, '20CH': 20, '21CH': 21, '22CH': 22, '23CH': 23, '24CH': 24, '25CH': 25,
		'26CH': 26, '27CH': 27, '28CH': 28, '29CH': 29, '30CH': 30, '31CH': 31, '32CH': 32
    }
    var identifier="";
    for(var i = 0; i<4;i++){
        identifier = identifier + String.fromCharCode(viewData.getInt8(1080+i));
	    }
    //document.write(identifier+"                ");
    this.channelNum=channelNumTable[identifier];
    //document.write(this.channelNum);
    
    this.c_offset = 1084 + 1024 * this.PatternNum;
    this.samples[0].offset = this.c_offset;
    for (var i = 1; i < 31; i++) {
        this.c_offset = this.c_offset + this.samples[i - 1].length;
        this.samples[i].offset = this.c_offset;
    }



    /*store all the patterns*/
    this.Patterns = [];
    var currentoffset = 0;

    /*Patterns[] is a 3D array, each pattern is a 2D array, row is row and channel is column.
      Attribute of Pattern: 
                           Sample: the sample to be played
                           period: period
			   effect: the effect to be implemented
		       	   effectPara: parameter to determine the effect
			   periodchange:period change caused by effect
			   volumechange:volume change caused by effect
			   volume: initial volume of the sample*/
    for (var pattern = 0; pattern < this.PatternNum; pattern++) {
        this.Patterns[pattern] = [];
        for (var row = 0; row < 64; row++) {
            this.Patterns[pattern][row] = [];
            for (var channel = 0; channel < this.channelNum; channel++) {
                var a1 = viewData.getUint8(1084 + currentoffset);
                var a2 = viewData.getUint8(1084 + currentoffset + 1);
                var a3 = viewData.getUint8(1084 + currentoffset + 2);
                var a4 = viewData.getUint8(1084 + currentoffset + 3);
                currentoffset += 4;
                this.Patterns[pattern][row][channel] = {
                    sample: (a1 & 0xf0) | (a3 >> 4),
                    period: ((a1 & 0x0f) << 8) | a2,
		    effect: a3 & 0x0f,
                    effectPara: a4,
                    periodchange: 0,
                    volumechange: 0,
                    volume: 0,
                }

                var note = this.Patterns[pattern][row][channel];

                switch (note.effect) {
                case 1:
                    note.periodchange = note.effectPara;

                case 2:
                    note.periodchange = note.effectPara;

                case 0x0a:
                    if (note.effectPara & 0xf0) {
                        note.volumechange = note.effectPara >> 4;
                    } else {

                        note.volumechange = -note.effectPara;
                    }

                case 0x0c:
                    if (note.effectPara > 64) {
                        note.volume = 64;
                    } else {
                        note.volume = note.effectPara;
                    }

                }
                if (note.period != 0 && note.sample != 0) {
                    note.volume = this.samples[note.sample - 1].volume;
                    note.notenum = ModPeriodToNoteNumber[note.period + note.periodchange];
                    note.pitch = ModPeriodTable[this.samples[note.sample - 1].finetune][note.notenum] * 2;
                }
            }

        }
    }
}

function schedSound(source, when_secs, pitch, tickspersample, volume, volumechange, samplenum, modfile) {
    var viewData = new DataView(modfile.m_buffer);
    if (modfile.samples[samplenum].repeatLength > 2) {
	//repeat time: set to be a long period, actually repeat time is controled in schedSound.
        var repeattime = 200000 / modfile.samples[samplenum].repeatLength; 
        var audio = context.createBuffer(1, modfile.samples[samplenum].length + modfile.samples[samplenum].repeatLength * repeattime, 44100);
        var data = new Float32Array(modfile.samples[samplenum].length + modfile.samples[samplenum].repeatLength * repeattime);
        data = audio.getChannelData(0);
        //write the ChannelData in audiobuffer
        for (var j = 0; j < modfile.samples[samplenum].length; j++) {

            data[j] = viewData.getInt8(modfile.samples[samplenum].offset + j) / 128 / 512 * (volume + volumechange);
        }
        for (var k = 0; k < repeattime; k++) {
            for (var j = 0; j < modfile.samples[samplenum].repeatLength; j++) {
                data[modfile.samples[samplenum].length + k * modfile.samples[samplenum].repeatLength + j] = data[modfile.samples[samplenum].repeatOffset + j];
            }
        }
    } else {
        var audio = context.createBuffer(1, modfile.samples[samplenum].length, 44100);
        var data = new Float32Array(modfile.samples[samplenum].length);
        data = audio.getChannelData(0);
        for (var j = 0; j < modfile.samples[samplenum].length; j++) {

            data[j] = viewData.getInt8(modfile.samples[samplenum].offset + j) / 128 / 512 * (volume + volumechange);
        }
    }
    source.buffer = audio;
    source.playbackRate.value = (tickspersample / pitch);
    source.connect(context.destination);
    source.noteOn(when_secs);
}

function Player(name) {
    //in PAL machines the clock rate is 7093789.2 Hz and for NTSC machines it is 7159090.5 Hz, hence tickspersample is PAL/44100=160.8569
    //or NTSC/44100 = 162/33765, here assuming it is a PAL machine.
    
    var ticksperSample = 160.8569; //162.33765;
    var modfile = new ModReader(name);
    //for Audio source to deal with the 4 channels to be played.
    var sources={};
    
    for(var c=0; c< modfile.channelNum; c++){
	sources[c]= context.createBufferSource();
    }
    
    console.log("rinima");
    //time to keep track of how long the mod has been played.
    var m_time = context.currentTime;
    var currentChannels={};
    for (var i = 0; i < modfile.OrderListLength; i++) {
        //load one pattern
        var currentPattern = modfile.Patterns[modfile.OrderList[i]];
        for (var j = 0; j < 64; j++) {
	    for( var k=0;k< modfile.channelNum; k++){
		currentChannels[k]=currentPattern[j][k];
	    
	    //play one division in 0.12s, the default bpm is 125, 24 frames a beat, 6 frames a division, so a division plays 0.12s.
	    //start with context.currentTime,initially m_time = currentTime, each pattern is played for 7.68s, hence the next pattern should be played
	    //at m_time+i*7.68, i is the number of patterns played before.
		if(currentChannels[k].sample!=0){
		    if(j!=0){
			sources[k].noteOff(m_time + i * 7.68 + j * 0.12);
		    }
		     sources[k] = context.createBufferSource();
                schedSound(sources[k], m_time + i * 7.68 + j * 0.12, currentChannels[k].pitch, ticksperSample, currentChannels[k].volume, currentChannels[k].volumechange, currentChannels[k].sample - 1, modfile);
		}
	    }
            
        }
    }
}

