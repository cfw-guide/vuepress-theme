<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{ pageTitle }}</h1>
      <Content />
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
} from '@vuepress/client'
import { computed } from 'vue'
import type { DefaultThemeHomePageFrontmatter } from '../../shared'

const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>()

const pageTitle = computed(() => {
  if (frontmatter.value.title === null) {
    return null
  }
  return frontmatter.value.title
})
</script>
