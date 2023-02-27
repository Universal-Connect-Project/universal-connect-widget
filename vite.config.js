import babel from '@rollup/plugin-babel'
import react from '@vitejs/plugin-react'
import { readFile } from 'fs/promises'
//import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    babel({
      include: ['**/node_modules/@kyper/**/*.js'],
      babelHelpers: 'bundled',
    }),
    react(),
  ],
  // define: {
  //   // eslint-disable-next-line no-process-env
  //   //'process.env': process.env,
  // },

  define: {
    global: {},
  },
  // resolve: {
  //   alias: {
  //     '@assets': resolve(__dirname, 'app/assets'),
  //     '~': resolve(__dirname, 'app/javascript'),
  //   },
  // },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /node_modules\/@kyper.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await readFile(args.path, 'utf8'),
            }))
          },
        },
      ],
    },
  },
})

