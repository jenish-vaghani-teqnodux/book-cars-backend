const babel = (api) => {
  const isTest = api.env('test')

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./dist/src'],
        alias: {
          ':bookcars-types': './bookcars-types',
          src: './dist/src',
        },
      },
    ],
  ]

  if (!isTest) {
    plugins.push('add-import-extension')
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            node: '18',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins,
  }
}

export default babel
