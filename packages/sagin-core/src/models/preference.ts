export const PreferenceCategory = Object.freeze({
  Display: 'display',
});

export const Preference = Object.freeze({
  Lang: {
    category: PreferenceCategory.Display,
    key: 'lang',
  },
  TimeZone: {
    category: PreferenceCategory.Display,
    key: 'tz',
  },
});
