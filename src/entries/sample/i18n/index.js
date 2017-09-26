/**
 * entries/sample/i18n/index.js
 * Using a simple i18n manager common to all entries
 * to create an instance of "vue-i18n".
 * Setting "en" to be the default language for "sample" entry.
 */
import i18n from '../../../i18n';

module.exports = i18n.create({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: require('./en'),
        ja: require('./ja')
    }
});

