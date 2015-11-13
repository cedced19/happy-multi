﻿phonon.options({
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
                phonon.i18n().get(['error', 'no_table', 'ok'], function (values) {
                    phonon.alert(values.no_table, values.error, false, values.ok);
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
            phonon.i18n().get(['warning', 'question_sure', 'ok', 'cancel'], function (values) {
                var confirm = phonon.confirm(values.question_sure, values.warning, true, values.ok, values.cancel);
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

        var last = {
            one: '',
            two: ''
        };
        var timer = 0;
        var rights = 0;
        var summarize = [];

        var determinate = function () {
            var operation = {};
            operation.one = Math.floor(Math.random() * 10) + 1;
            operation.two = numbers[Math.floor(Math.random() * numbers.length)];
            operation.result = operation.two * operation.one;
            if (last.one == operation.one && last.two == operation.two) {
                return determinate();
            } else {
                last = operation;
                document.querySelector('#one').textContent = operation.one;
                document.querySelector('#two').textContent = operation.two;
                return operation;
            }
        };
        
        var current = determinate();

        document.querySelector('#rights').textContent = rights;

        document.querySelector('#result').on('keyup', function () {
            if (current.result == this.value) {
                summarize.push({
                    one: current.one,
                    two: current.two,
                    time: timer
                });
                timer = 0;
                this.value = '';
                rights++;
                document.querySelector('#rights').textContent = rights;
                current = determinate();
                if (rights == 20) {
                    phonon.navigator().changePage('summarize', summarize);
                }
            }
        });

        document.querySelector('#result').on('keydown', function (e) {
            e.target.removeEventListener(e.type, arguments.callee);
            setInterval(function () {
                timer++;
            }, 1000);
        });
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
            phonon.i18n().get(['language_confirm', 'information', 'ok'], function (values) {
                phonon.alert(values.language_confirm, values.information, false, values.ok);
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

phonon.navigator().on({ page: 'summarize', content: 'summarize.html', preventClose: false, readyDelay: 0 }, function (activity) {
    
});

phonon.i18n().bind();
phonon.navigator().start();