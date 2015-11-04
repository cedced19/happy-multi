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

// phonon.updateLocale('en'); to test in english

phonon.i18n().bind();
phonon.navigator().start();