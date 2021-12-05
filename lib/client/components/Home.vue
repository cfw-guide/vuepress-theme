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
      
      <div v-if="adTagOne && adsBool" style="text-align: center;">
          <div :id=adTagOne></div>
      </div>
      <hr v-if="adTagOne && adTagTwo && adsBool">
      <div v-if="adTagTwo && adsBool" style="text-align: center;">
          <div :id=adTagTwo></div>
      </div>

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

const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>()
const siteLocale = useSiteLocaleData()
const themeLocale = useThemeLocaleData()

// hero image and title
const heroImage = computed(() => {
  if (!frontmatter.value.header.overlay_image) {
    return null
  }

  return withBase(frontmatter.value.header.overlay_image)
})

const heroColor = computed(() => {
  if (!frontmatter.value.header.overlay_color) {
    return null
  }

  return frontmatter.value.header.overlay_color
})

const heroFilter = computed(() => {
  if (!frontmatter.value.header.overlay_filter) {
    return 0
  }

  return frontmatter.value.header.overlay_filter
})

const heroText = computed(() => {
  if (frontmatter.value.header.overlay_title === null) {
    return null
  }
  return frontmatter.value.header.overlay_title || siteLocale.value.title || 'Hello'
})
const heroBtnText = computed(() => {
  if (frontmatter.value.header.cta_label === null) {
    return null
  }
  return frontmatter.value.header.cta_label
})
const heroBtnLink = computed(() => {
  if (frontmatter.value.header.cta_url === null) {
    return null
  }
  return frontmatter.value.header.cta_url
})
const heroAlt = computed(
  () => frontmatter.value.heroAlt || heroText.value || 'hero'
)
const tagline = computed(() => {
  if (frontmatter.value.header.overlay_excerpt === null) {
    return null
  }
  return (
    frontmatter.value.header.overlay_excerpt ||
    siteLocale.value.description ||
    'Welcome to your VuePress site'
  )
})

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
