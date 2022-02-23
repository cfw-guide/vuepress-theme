<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{ pageTitle }}</h1>
      <div class="custom-container tip" v-if="discordNoticeText" v-html="discordNoticeText"/>

      <template v-for="(ad, index) in adArr" :key="ad">
        <template v-if="index % 2 == 0">
          <div :id='ad.id' :style='`min-width: ${ad.minWidth}px; min-height: ${ad.minHeight}px;`' v-html="`<script>googletag.cmd.push(function() { googletag.display('${ad.id}'); });</script>`"/>
        </template>
      </template>
      
      <Content />

      <template v-for="(ad, index) in adArr" :key="ad">
        <template v-if="index % 2 != 0">
          <div :id='ad.id' :style='`min-width: ${ad.minWidth}px; min-height: ${ad.minHeight}px;`' v-html="`<script>googletag.cmd.push(function() { googletag.display('${ad.id}'); });</script>`"/>
        </template>
      </template>
    </div>

    <PageMeta />

    <PageNav />

    <slot name="bottom" />
  </main>
</template>

<script setup lang="ts">
import PageMeta from './PageMeta.vue'
import PageNav from './PageNav.vue'
import {
  usePageFrontmatter,
  useSiteLocaleData,
} from '@vuepress/client'
import { computed } from 'vue'
import type { DefaultThemeHomePageFrontmatter } from '../../shared'
const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>()
import { useThemeLocaleData } from '../composables'
import MarkdownIt from 'markdown-it'

const themeLocale = useThemeLocaleData()

const discordNoticeText = computed(() => {
  var discordNoticeText = frontmatter.value.discordNoticeText || themeLocale.value.discordNoticeText
  if (!discordNoticeText) return

  var md = new MarkdownIt();

  discordNoticeText = md.render(discordNoticeText)
  
  return '<p>' + discordNoticeText + '</p>'
})

const adArr = computed(() => {
  var adArr = themeLocale.value.adArr
  if (!adArr || (frontmatter.value.ads === false)) return

  return adArr
})

const pageTitle = computed(() => {
  if (!frontmatter.value.title) return
  return frontmatter.value.title
})
</script>
