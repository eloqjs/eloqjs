/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'ELOQJS',
  tagline: 'Dinosaurs are cool',
  url: 'https://eloqjs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'eloqjs',
  projectName: 'eloqjs',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula')
    },
    navbar: {
      title: 'ELOQJS',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Tutorial'
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API'
        },
        {
          href: 'https://github.com/eloqjs/eloqjs',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} ELOQJS, Inc.`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/eloqjs/eloqjs/edit/dev/website/',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]
          ]
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/eloqjs/eloqjs/edit/dev/website/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
