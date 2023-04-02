import type { Theme } from '@vuepress/core'
import { defaultTheme } from '@vuepress/theme-default'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { path } from '@vuepress/utils'

export const localTheme = (options: DefaultThemeOptions): Theme => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme(options),
    alias: {
      '@theme/Page.vue': path.resolve(__dirname, './components/Page.vue'),
      '@theme/PageMeta.vue': path.resolve(__dirname, './components/PageMeta.vue'),
      '@theme/Home.vue': path.resolve(__dirname, './components/Home.vue'),
      '@theme/HomeHero.vue': path.resolve(__dirname, './components/HomeHero.vue'),
    },
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
    },
  }
}