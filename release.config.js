const pluginName = require('./package.json').name

module.exports = {
  branches: ["master"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/git",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "zip -qq -r " + pluginName + "${nextRelease.version}.zip dist readme.md logo.png package.json",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "logseq-plugin-template-react-*.zip",
      },
    ],
  ],
};
