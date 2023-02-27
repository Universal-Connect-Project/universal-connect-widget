// vite.config.js
import babel from "file:///Users/bryant.morrill/Documents/repos/universal-connect-widget/node_modules/@rollup/plugin-babel/dist/es/index.js";
import react from "file:///Users/bryant.morrill/Documents/repos/universal-connect-widget/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { readFile } from "fs/promises";
import { defineConfig } from "file:///Users/bryant.morrill/Documents/repos/universal-connect-widget/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    babel({
      include: ["**/node_modules/@kyper/**/*.js"],
      babelHelpers: "bundled"
    }),
    react()
  ],
  define: {
    // eslint-disable-next-line no-process-env
    "process.env": process.env
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
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /node_modules\/@kyper.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYnJ5YW50Lm1vcnJpbGwvRG9jdW1lbnRzL3JlcG9zL3VuaXZlcnNhbC1jb25uZWN0LXdpZGdldFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2JyeWFudC5tb3JyaWxsL0RvY3VtZW50cy9yZXBvcy91bml2ZXJzYWwtY29ubmVjdC13aWRnZXQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2JyeWFudC5tb3JyaWxsL0RvY3VtZW50cy9yZXBvcy91bml2ZXJzYWwtY29ubmVjdC13aWRnZXQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgYmFiZWwgZnJvbSAnQHJvbGx1cC9wbHVnaW4tYmFiZWwnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gJ2ZzL3Byb21pc2VzJ1xuLy9pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBiYWJlbCh7XG4gICAgICBpbmNsdWRlOiBbJyoqL25vZGVfbW9kdWxlcy9Aa3lwZXIvKiovKi5qcyddLFxuICAgICAgYmFiZWxIZWxwZXJzOiAnYnVuZGxlZCcsXG4gICAgfSksXG4gICAgcmVhY3QoKSxcbiAgXSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb2Nlc3MtZW52XG4gICAgJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnYsXG4gIH0sXG4gIC8vIHJlc29sdmU6IHtcbiAgLy8gICBhbGlhczoge1xuICAvLyAgICAgJ0Bhc3NldHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FwcC9hc3NldHMnKSxcbiAgLy8gICAgICd+JzogcmVzb2x2ZShfX2Rpcm5hbWUsICdhcHAvamF2YXNjcmlwdCcpLFxuICAvLyAgIH0sXG4gIC8vIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxuICAgICAgICAgIHNldHVwKGJ1aWxkKSB7XG4gICAgICAgICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC9ub2RlX21vZHVsZXNcXC9Aa3lwZXIuKlxcLmpzJC8gfSwgYXN5bmMgKGFyZ3MpID0+ICh7XG4gICAgICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXG4gICAgICAgICAgICAgIGNvbnRlbnRzOiBhd2FpdCByZWFkRmlsZShhcmdzLnBhdGgsICd1dGY4JyksXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VyxPQUFPLFdBQVc7QUFDOVgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZ0JBQWdCO0FBRXpCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxnQ0FBZ0M7QUFBQSxNQUMxQyxjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFFBQVE7QUFBQTtBQUFBLElBRU4sZUFBZSxRQUFRO0FBQUEsRUFDekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9BLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU0sT0FBTztBQUNYLGtCQUFNLE9BQU8sRUFBRSxRQUFRLDhCQUE4QixHQUFHLE9BQU8sVUFBVTtBQUFBLGNBQ3ZFLFFBQVE7QUFBQSxjQUNSLFVBQVUsTUFBTSxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQUEsWUFDNUMsRUFBRTtBQUFBLFVBQ0o7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
