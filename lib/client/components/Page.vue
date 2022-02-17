<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{ pageTitle }}</h1>
      <div class="custom-container tip" v-if="discordNoticeText" v-html="discordNoticeText"/>

      <div v-for="(ad, index) in adArr" :key="ad">
        <template v-if="index % 2 == 0">
          <div v-html="`<script>
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
              googletag.defineSlot('${ad.name}', ${ad.size}, '${ad.id}').addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.enableServices();
            });
          </script>`"/>
          <div :id='ad.id' v-html="`<script>googletag.cmd.push(function() { googletag.display('${ad.id}'); }); </script>`"/>
        </template>
      </div>
      
      <Content />

      <div v-for="(ad, index) in adArr" :key="ad">
        <template v-if="index % 2 != 0">
          <div v-html="`<script>
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
              googletag.defineSlot('${ad.name}', ${ad.size}, '${ad.id}').addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.enableServices();
            });
          </script>`"/>
          <div :id='ad' v-html="`<script>googletag.cmd.push(function() { googletag.display('${ad.id}'); }); </script>`"/>
        </template>
      </div>
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

const themeLocale = useThemeLocaleData()

const discordNoticeText = computed(() => {
  var discordNoticeText = frontmatter.value.discordNoticeText || themeLocale.value.discordNoticeText
  if (!discordNoticeText) return

  var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

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
