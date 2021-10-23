<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{ pageTitle }}</h1>
      <div class="custom-container tip" v-if="discordNoticeText" v-html="discordNoticeText" />
      
      <hr v-if="adTagOne && adsBool">
      <div v-if="adTagOne && adsBool" style="text-align: center;">
          <div :id=adTagOne></div>
      </div>
      <hr v-if="adTagOne && adsBool">
      
      <Content />
      
      <hr v-if="adTagTwo && adsBool">
      <div v-if="adTagTwo && adsBool" style="text-align: center;">
          <div :id=adTagTwo></div>
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
  var discordNoticeText = themeLocale.value.discordNoticeText
  if (discordNoticeText === null) {
    return null
  }
  
  try {
    var md = require('markdown-it')()
    var render = md.render(discordNoticeText)
  } catch {
    return discordNoticeText
  }
  
  return render
})

const adTagOne = computed(() => {
  var adTagOne = themeLocale.value.adTagOne
  if (adTagOne === null) {
    return null
  }
  
  return adTagOne
})

const adTagTwo = computed(() => {
  var adTagTwo = themeLocale.value.adTagTwo
  if (adTagTwo === null) {
    return null
  }
  
  return adTagTwo
})

const adsBool = computed(() => {
  if (frontmatter.value.ads == null) {
    return true
  }
  
  return frontmatter.value.ads
})

const pageTitle = computed(() => {
  if (frontmatter.value.title === null) {
    return null
  }
  return frontmatter.value.title
})
</script>
