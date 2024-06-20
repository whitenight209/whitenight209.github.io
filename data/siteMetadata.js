/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
    title: 'Fallow the Star',
    author: 'CheolHo Park',
    headerTitle: 'Dev Blog',
    description: 'My Dev Blog',
    language: 'en-us',
    theme: 'system', // system, dark or light
    siteUrl: 'https://tailwind-nextjs-starter-blog.vercel.app',
    siteRepo: 'https://github.com/timlrx/tailwind-nextjs-starter-blog',
    siteLogo: '/static/images/logo.png',
    socialBanner: '/static/images/twitter-card.png',
    mastodon: 'https://mastodon.social/@mastodonuser',
    email: 'whitenight209@gmail.com',
    github: 'https://github.com/whitenight209',
    x: 'https://twitter.com/x',
    // twitter: 'https://twitter.com/Twitter',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://www.linkedin.com/in/cheolho-park-381354234',
    threads: 'https://www.threads.net',
    instagram: 'https://www.instagram.com',
    locale: 'en-US',
    analytics: {
        // If you want to use an analytics provider you have to add it to the
        // content security policy in the `next.config.js` file.
        // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
        umamiAnalytics: {
            // We use an env variable for this site to avoid other users cloning our analytics ID
            umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
            // You may also need to overwrite the script if you're storing data in the US - ex:
            // src: 'https://us.umami.is/script.js'
            // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
        },
        // plausibleAnalytics: {
        //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
        // },
        // simpleAnalytics: {},
        // posthogAnalytics: {
        //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
        // },
        // googleAnalytics: {
        //   googleAnalyticsId: '', // e.g. G-XXXXXXX
        // },
    },
    newsletter: {
        // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
        // Please add your .env file and modify it according to your selection
        provider: 'buttondown',
    },
    comments: {
        // If you want to use an analytics provider you have to add it to the
        // content security policy in the `next.config.js` file.
        // Select a provider and use the environment variables associated to it
        // https://vercel.com/docs/environment-variables
        provider: 'giscus', // supported providers: giscus, utterances, disqus
        giscusConfig: {
            theme: 'light',
            darkTheme: '',
            mapping: 'pathname',
            repo: 'whitenight209/whitenight209.github.io',
            repositoryId: 'R_kgDOMGsXXw',
            category: 'General',
            categoryId: 'DIC_kwDOMGsXX84CgNV8',
            reactions: true,
            metadata: false,
            inputPosition: 'bottom',
            lang: 'ko'
        }
    },
    search: {
        provider: 'kbar', // kbar or algolia
        kbarConfig: {
            searchDocumentsPath: 'search.json', // path to load documents to search
        },
        // provider: 'algolia',
        // algoliaConfig: {
        //   // The application ID provided by Algolia
        //   appId: 'R2IYF7ETH7',
        //   // Public API key: it is safe to commit it
        //   apiKey: '599cec31baffa4868cae4e79f180729b',
        //   indexName: 'docsearch',
        // },
    },
}

module.exports = siteMetadata
