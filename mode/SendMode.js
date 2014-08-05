// Written by Jürgen Moßgraber - mossgrabers.de
//            Michael Schmalle - teotigraphix.com
// (c) 2014
// Licensed under GPLv3 - http://www.gnu.org/licenses/gpl.html

SendMode.PARAM_NAMES   =
[
    'Send 1   Send 1  Send 1   Send 1  Send 1   Send 1  Send 1   Send 1  ',
    'Send 2   Send 2  Send 2   Send 2  Send 2   Send 2  Send 2   Send 2  ',
    'Send 3   Send 3  Send 3   Send 3  Send 3   Send 3  Send 3   Send 3  ',
    'Send 4   Send 4  Send 4   Send 4  Send 4   Send 4  Send 4   Send 4  ',
    'Send 5   Send 5  Send 5   Send 5  Send 5   Send 5  Send 5   Send 5  ',
    'Send 6   Send 6  Send 6   Send 6  Send 6   Send 6  Send 6   Send 6  '
];

function SendMode (model)
{
    AbstractTrackMode.call (this, model);
    this.id = MODE_SEND;
}
SendMode.prototype = new AbstractTrackMode ();

SendMode.prototype.onValueKnob = function (index, value)
{
    var sendIndex = this.getCurrentSendIndex ();
    this.model.getTrackBank ().changeSend (index, sendIndex, value, this.surface.getFractionValue ());
};

// SendMode.prototype.onFirstRow = function (index) {};

// SendMode.prototype.onSecondRow = function (index) {};

SendMode.prototype.updateDisplay = function ()
{
    var d = this.surface.display;
    var sendIndex = this.getCurrentSendIndex ();
    var tb = this.model.getTrackBank ();

    d.setRow (0, SendMode.PARAM_NAMES[sendIndex]);

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        d.setCell (1, i, t.sends[sendIndex].volumeStr, Display.FORMAT_RAW)
         .setCell (2, i, t.sends[sendIndex].volume, Display.FORMAT_VALUE);
    }
    d.done (1).done (2);

    this.drawRow4 ();
};

// SendMode.prototype.updateFirstRow = function () {};

// SendMode.prototype.updateSecondRow = function () {};

SendMode.prototype.getCurrentSendIndex = function ()
{
    return this.surface.getCurrentMode () - MODE_SEND1;
};
