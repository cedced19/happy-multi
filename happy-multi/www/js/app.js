phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true
    },
    i18n: { 
            directory: 'langs/',
            localeFallback: 'en'
    }
});

var language = localStorage.getItem('language') || (window.navigator.userLanguage || window.navigator.language).split('-')[0];
phonon.updateLocale(language);

phonon.navigator().on({page: 'home', preventClose: false, readyDelay: 0}, function(activity) {

    activity.onCreate(function() {
        
    });
});

phonon.navigator().on({page: 'language', preventClose: false, readyDelay: 0}, function (activity) {
    var radios = document.getElementsByName('language');

    activity.onCreate(function () {
        document.querySelector('#language-btn').on('click', function () {
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    localStorage.setItem('language', radios[i].value);
                    phonon.updateLocale(radios[i].value);
                    language = radios[i].value;
                    break;
                }
            }
        });
    });

    activity.onReady(function () {
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].value == language) {
                radios[i].checked = true;
                break;
            }
        }
    });
});

phonon.i18n().bind();
phonon.navigator().start();