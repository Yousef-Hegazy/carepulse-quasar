import { defineBoot } from '#q-app/wrappers';
import { Lang, LocalStorage } from 'quasar';

// relative path to your node_modules/quasar/..
// change to YOUR path
// const langList = import.meta.glob('../../node_modules/quasar/lang/*.js')
// const langList = import.meta.glob('../../node_modules/quasar/lang/(ar|en).js')
const languages = {
  'en-US': () => import('quasar/lang/en-US'),
  'ar': () => import('quasar/lang/ar')
}
// or just a select few (example below with only DE and FR):
// import.meta.glob('../../node_modules/quasar/lang/(de|fr).js')

export default defineBoot(async () => {
  const langIso = String(LocalStorage.getItem('lang') || 'en-US');

  const fullPath = `../../node_modules/quasar/lang/${langIso}.js`;

  try {
    // langList[`../../node_modules/quasar/lang/${langIso}.js`]().then((lang: any) => {
    //   Lang.set(lang.default)
    // });

    const loadLang = languages[langIso as 'ar' | 'en-US'] || languages['en-US']
    const lang = await loadLang()
    Lang.set(lang.default);

    // if (langList[fullPath]) {
    //   const lang: any = await langList[fullPath]();
    //   Lang.set(lang.default);
    // } else {
    //   console.warn(`Language pack ${langIso} not found in glob.`);
    // }
  }
  catch (err) {
    console.error(err)
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
})