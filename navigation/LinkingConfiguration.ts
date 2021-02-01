import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          MainHome: {
            screens: {
              MainHome: 'MainHome',
            },
          },
          MainSettings: {
            screens: {
              MainSettings: 'MainSettings',
            },
          },
        },
      },
      InitializeStart: {
        screens: {
          InitializeStart: {
            screens: {
              InitializeStart: 'InitializeStart',
            },
          },
        },
      },
      InitializeWelcome: {
        screens: {
          InitializeWelcome: {
            screens: {
              InitializeWelcome: 'InitializeWelcome',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
