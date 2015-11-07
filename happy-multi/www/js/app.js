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
    var checkbox = document.querySelectorAll('input[type=checkbox]');

    activity.onCreate(function () {
        document.querySelector('#start-btn').on('click', function () {
            var numbers = [];
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked) {
                    numbers.push(checkbox[i].name);
                }
            }
            localStorage.setItem('numbers', numbers);
            if (numbers.length === 0) {
                phonon.i18n().get(['error', 'no_table'], function (values) {
                    phonon.alert(values.no_table, values.error, false);
                });
            } else {
                phonon.navigator().changePage('game');
            }
        });
    });

    activity.onReady(function () {
        var numbers = localStorage.getItem('numbers');
        for (var i = 0; i < numbers.length; i++) {
            for (var j = 0; j < checkbox.length; j++) {
                if (numbers[i] == checkbox[j].name) {
                    checkbox[j].checked = true;
                }
            }
        }
    });
});

phonon.navigator().on({page: 'game', preventClose: false, readyDelay: 0}, function (activity) {

    activity.onCreate(function () {
        document.querySelector('#exit-btn').on('click', function () {
            phonon.i18n().get(['warning', 'question_sure'], function (values) {
                var confirm = phonon.confirm(values.question_sure, values.warning, true);
                confirm.on('confirm', function () {
                    phonon.navigator().changePage('home');
                });
                confirm.on('cancel', function () {

                });
            });
        });
    });

    activity.onReady(function () {
        console.log(localStorage.getItem('numbers'));
    });
});

phonon.navigator().on({page: 'language', preventClose: false, readyDelay: 0}, function (activity) {
    var radios = document.getElementsByName('language');

    activity.onCreate(function () {
        document.querySelector('#language-btn').on('click', function () {
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    localStorage.setItem('language', radios[i].value);
                    phonon.updateLocale(radios[i].value);
                    language = radios[i].value;
                    break;
                }
            }
            phonon.i18n().get(['language_confirm', 'information'], function (values) {
                phonon.alert(values.language_confirm, values.information, false);
            });
        });
    });

    activity.onReady(function () {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].value == language) {
                radios[i].checked = true;
                break;
            }
        }
    });
});

phonon.i18n().bind();
phonon.navigator().start();