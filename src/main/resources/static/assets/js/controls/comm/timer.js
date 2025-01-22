let TIMER;

function timerOn(time, elem, callback) {
    let min = 0;
    let sec = 0;

    TIMER = setInterval(function() {
        min = parseInt(time / 60);
        sec = numberPad(parseInt(time % 60),2);

        $(elem).text(min + ':' + sec);
        time--;

        if(time < 0) {
            clearInterval(TIMER);

            if(callback) callback();
        }

    }, 1000);
}

function timerOff(callback) {
    clearInterval(TIMER);
    if(callback) callback();
}