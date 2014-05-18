// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

TransportProxy.INC_FRACTION_TIME      = 1.0;	    // 1 beat
TransportProxy.INC_FRACTION_TIME_SLOW = 1.0 / 20;	// 1/20th of a beat
TransportProxy.TEMPO_RESOLUTION       = 647;

function TransportProxy (push)
{
	this.push = push;

	this.transport = host.createTransport ();

	this.isRecording = false;
	
	// Note: For real BPM add 20
	this.setInternalTempo (100);

	this.transport.addClickObserver (doObject (this, function (isOn)
	{
		this.push.setButton (PUSH_BUTTON_CLICK, isOn ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
	}));
	// Play
	this.transport.addIsPlayingObserver (doObject (this, function (isPlaying)
	{
		this.push.setButton (PUSH_BUTTON_PLAY, isPlaying ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
	}));
	// Record
	this.transport.addIsRecordingObserver (doObject (this, function (isRec)
	{
		this.isRecording = isRec;
		this.push.setButton (PUSH_BUTTON_RECORD, isRec ? PUSH_BUTTON_STATE_HI : PUSH_BUTTON_STATE_ON);
	}));
	// Tempo
	this.transport.getTempo ().addValueObserver (TransportProxy.TEMPO_RESOLUTION, doObject (this, function (value)
	{
		this.setInternalTempo (value);
	}));
}

TransportProxy.prototype.play = function      ()
{
	this.transport.play ();
};

TransportProxy.prototype.record = function      ()
{
	this.transport.record ();
};

TransportProxy.prototype.toggleLoop = function ()
{
	this.transport.toggleLoop ();
};

TransportProxy.prototype.toggleClick = function ()
{
	this.transport.toggleClick ();
};

TransportProxy.prototype.toggleClipOverdub = function ()
{
	this.transport.toggleLauncherOverdub ();
};

TransportProxy.prototype.toggleWriteArrangerAutomation = function ()
{
	this.transport.toggleWriteArrangerAutomation ();
};

TransportProxy.prototype.changePosition = function (increase, slow)
{
	var frac = slow ? TransportProxy.INC_FRACTION_TIME_SLOW : TransportProxy.INC_FRACTION_TIME;
	this.transport.incPosition (increase ? frac : -frac, false);
};

TransportProxy.prototype.changeTempo = function (increase)
{
	this.tempo = increase ? Math.min (this.tempo + 1, TransportProxy.TEMPO_RESOLUTION) : Math.max (0, this.tempo - 1);
	this.transport.getTempo ().set (this.tempo, TransportProxy.TEMPO_RESOLUTION);
};

TransportProxy.prototype.setTempo = function (bpm)
{
	this.transport.getTempo ().set (Math.min (Math.max (0, bpm - 20), TransportProxy.TEMPO_RESOLUTION), TransportProxy.TEMPO_RESOLUTION);
};

TransportProxy.prototype.setTempoIndication = function (isTouched)
{
	this.transport.getTempo ().setIndication (isTouched);
};

TransportProxy.prototype.setLauncherOverdub = function (on)
{
	// Note: This is a bug: On and off are switched
	this.transport.setLauncherOverdub (!on);
};

TransportProxy.prototype.setInternalTempo = function (t)
{
	this.tempo = t;
	this.quarterNoteInMillis = 60000 / (t + 20);
};