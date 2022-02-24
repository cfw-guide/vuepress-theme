<template>

  <main class="splash" :aria-labelledby="heroText ? 'main-title' : undefined">
    <header class="hero heroImage" :style="{'background-image':'linear-gradient(rgba(0, 0, 0, ' + heroFilter + '), rgba(0, 0, 0, ' + heroFilter + ')), url(' + heroImage + ')', 'background-color':heroColor}">
      <div class="wrapper">
        <h1 v-if="heroText" id="main-title">
          {{ heroText }}
        </h1>

        <p v-if="tagline" class="description">
          {{ tagline }}
        </p>

        <p v-if="heroBtnText"><router-link class="heroBtn" :to=heroBtnLink>{{heroBtnText}}</router-link></p>

        <p v-if="actions.length" class="actions">
          <NavLink
            v-for="action in actions"
            :key="action.text"
            class="action-button"
            :class="[action.type]"
            :item="action"
          />
        </p>
      </div>
    </header>

    <div class="home">
      
      <div class="custom-container tip" v-if="discordNoticeText" v-html="discordNoticeText" />
      
      <div v-if="features.length" class="features">
        <div v-for="feature in features" :key="feature.title" class="feature">
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.details }}</p>
        </div>
      </div>

      <div class="theme-default-content custom">
        <Content />
      </div>

      <template v-for="(ad, index) in adArr" :key="ad">
        <div :id='ad.id' style='text-align: center;' v-html="`<script>googletag.cmd.push(function() { googletag.display('${ad.id}'); });s</script>`"/>
        <br v-if="index != adArr.length - 1">
      </template>

      <template v-if="footer">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="footerHtml" class="footer" v-html="footer" />
        <div v-else class="footer" v-text="footer" />
      </template>

    </div>
  </main>
</template>

<script setup lang="ts">
import {
  usePageFrontmatter,
  useSiteLocaleData,
  withBase,
} from '@vuepress/client'

import { isArray } from '@vuepress/shared'
import { computed } from 'vue'
import type { DefaultThemeHomePageFrontmatter } from '../../shared'
import NavLink from './NavLink.vue'
import { useThemeLocaleData } from '../composables'
import MarkdownIt from 'markdown-it'

const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>()
const siteLocale = useSiteLocaleData()
const themeLocale = useThemeLocaleData()

// hero image and title
const heroImage = computed(() => {
  if (!frontmatter.value.header.overlay_image) return
  return withBase(frontmatter.value.header.overlay_image)
})

const heroColor = computed(() => {
  if (!frontmatter.value.header.overlay_color) return
  return frontmatter.value.header.overlay_color
})

const heroFilter = computed(() => {
  if (!frontmatter.value.header.overlay_filter) return 0

  return frontmatter.value.header.overlay_filter
})

const heroText = computed(() => {
  if (!frontmatter.value.header.overlay_title) return
  return frontmatter.value.header.overlay_title || siteLocale.value.title || 'Hello'
})
const heroBtnText = computed(() => {
  if (!frontmatter.value.header.cta_label) return
  return frontmatter.value.header.cta_label
})
const heroBtnLink = computed(() => {
  if (!frontmatter.value.header.cta_url) return
  return frontmatter.value.header.cta_url
})
const heroAlt = computed(
  () => frontmatter.value.heroAlt || heroText.value || 'hero'
)
const tagline = computed(() => {
  if (!frontmatter.value.header.overlay_excerpt) return
  return (
    frontmatter.value.header.overlay_excerpt ||
    siteLocale.value.description ||
    'Welcome to your VuePress site'
  )
})

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

// action buttons
const actions = computed(() => {
  if (!isArray(frontmatter.value.actions)) {
    return []
  }

  return frontmatter.value.actions.map(({ text, link, type = 'primary' }) => ({
    text,
    link,
    type,
  }))
})

// feature list
const features = computed(() => {
  if (isArray(frontmatter.value.features)) {
    return frontmatter.value.features
  }
  return []
})

// footer
const footer = computed(() => frontmatter.value.footer)
const footerHtml = computed(() => frontmatter.value.footerHtml)
</script>
