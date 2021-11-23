import mobiscroll from  "mobiscroll.javascript.min.js"
<link href="css/mobiscroll.javascript.min.css" rel="stylesheet" type="text/css" />

controlLoader = () => {
    mobiscroll.settings = {
        theme: 'ios',
        themeVariant: 'light',
        lang: 'en'
    };

    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        d = new Date(),
        diff = d.getDate() - d.getDay(),
        nextSunday = new Date(d.setDate(diff + 7)),
        slider = document.getElementById('slider'),
        nextWeek = {};
    
    function setText(d) {
        document.querySelector('.md-date').innerHTML = monthNames[d.getMonth()] + " " + d.getDate();
    }
    
    slider
        .addEventListener('change', function (ev) {
            setText(nextWeek[Math.round(this.value)]);
        });

    mobiscroll.form('#demo', {
        lang: 'en',                       // Specify language like: lang: 'pl' or omit setting to use default
        theme: 'ios',                     // Specify theme like: theme: 'ios' or omit setting to use default
        themeVariant: 'light'             // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/forms#opt-themeVariant
    });
    
    mobiscroll.slider('#slider', {
        theme: 'ios',                     // Specify theme like: theme: 'ios' or omit setting to use default
        themeVariant: 'light',            // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/forms#opt-themeVariant
        lang: 'en',                       // Specify language like: lang: 'pl' or omit setting to use default
        onInit: function (event, inst) {  // More info about onInit: https://docs.mobiscroll.com/4-10-9/javascript/forms#event-onInit
            var labels = slider.parentNode.querySelectorAll('.mbsc-progress-step-label');
    
            for (var i = 0; i < labels.length; ++i) {
                nextWeek[Math.round(labels[i].innerHTML)] = new Date(nextSunday.getFullYear(), nextSunday.getMonth(), nextSunday.getDate() + i); // generate nextWeek object
                labels[i].innerHTML = dayNames[i];
            }
            setText(nextSunday);
        }
    });
}