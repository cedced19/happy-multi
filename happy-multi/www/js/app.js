phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        templateRootDirectory: 'views/',
        enableBrowserBackButton: true
    },
    i18n: { 
            directory: 'langs/',
            localeFallback: 'en'
    }
});

var language = localStorage.getItem('language') || (window.navigator.userLanguage || window.navigator.language).split('-')[0];
phonon.updateLocale(language);

phonon.navigator().on({page: 'home', content: 'home.html', preventClose: false, readyDelay: 0}, function(activity) {

    activity.onCreate(function () {
        var checkboxs = document.querySelectorAll('input[type=checkbox]');
        document.querySelector('#start-btn').on('click', function () {
            var numbers = [];
            for (var i = 0; i < checkboxs.length; i++) {
                if (checkboxs[i].checked) {
                    numbers.push(checkboxs[i].name);
                }
            }
            localStorage.setItem('numbers', JSON.stringify(numbers));
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
        var checkboxs = document.querySelectorAll('input[type=checkbox]');
        var numbers = JSON.parse(localStorage.getItem('numbers'));
        for (var i = 0; i < numbers.length; i++) {
            for (var j = 0; j < checkboxs.length; j++) {
                if (numbers[i] == checkboxs[j].name) {
                    checkboxs[j].checked = true;
                    break;
                }
            }
        }
    });
});

phonon.navigator().on({ page: 'game', content: 'game.html', preventClose: false, readyDelay: 0 }, function (activity) {

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
        var numbers = JSON.parse(localStorage.getItem('numbers'));
        var text = '';
        for (var i = 0; i < numbers.length; i++) {
            text += numbers[i];
            if (i !== (numbers.length - 1)) {
                text += ', ';
            }
        };
        document.querySelector('#numbers').textContent = text;
    });
});

phonon.navigator().on({ page: 'language', content: 'language.html', preventClose: false, readyDelay: 0 }, function (activity) {

    activity.onCreate(function () {
        var radios = document.querySelectorAll('input[name=language]');
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
        var radios = document.querySelectorAll('input[name=language]');
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