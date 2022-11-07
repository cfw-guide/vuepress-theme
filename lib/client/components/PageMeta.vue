<template>
  <footer class="page-meta">
    <div v-if="editNavLink" class="meta-item edit-link">
      <NavLink class="meta-item-label" :item="editNavLink" />
    </div>

    <div v-if="contributors && contributors.length" class="meta-item contributors">
      <span class="meta-item-label">{{ contributors.length }} {{ pluralize('themeLocale.contributorsText', contributors.length)} }} </span>
      <span class="meta-item-info">
        <template v-for="(contributor, index) in contributors" :key="index">
          <a class="contributor-link" :href="`https://github.com/${contributor.name}`">
            <span :aria-label="`${contributor.name}`">
              <img :src="`https://github.com/${contributor.name}.png?size=40`" :alt="`${contributor.name}`" size="20" :title="`${contributor.name}`" width="20" height="20">
            </span>
          </a>
          <template v-if="index !== contributors.length - 1">, </template>
        </template>
      </span>
    </div>

    <div v-if="lastUpdated" class="meta-item last-updated">
      <ClientOnly>
        <span class="meta-item-info">{{ themeLocale.lastUpdatedText }} by {{ contributors[0] || {} }} on {{ format(new Date(lastUpdated), 'MMMM d, y') }}</span>
      </ClientOnly>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  usePageData,
  usePageFrontmatter,
  useSiteLocaleData,
} from '@vuepress/client'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  DefaultThemePageData,
  DefaultThemeNormalPageFrontmatter,
  NavLink as NavLinkType,
} from '../../shared'
import { useThemeLocaleData } from '../composables'
import { resolveEditLink } from '../utils'
import NavLink from './NavLink.vue'
import pluralize from 'pluralize'
import {format} from 'date-fns'

const useEditNavLink = (): ComputedRef<null | NavLinkType> => {
  const themeLocale = useThemeLocaleData()
  const page = usePageData<DefaultThemePageData>()
  const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()

  return computed(() => {
    const showEditLink =
      frontmatter.value.editLink ?? themeLocale.value.editLink ?? true
    if (!showEditLink) {
      return null
    }

    const {
      repo,
      docsRepo = repo,
      docsBranch = 'main',
      docsDir = 'docs',
      editLinkText,
    } = themeLocale.value

    if (!docsRepo) return null

    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern: themeLocale.value.editLinkPattern,
    })

    if (!editLink) return null

    return {
      text: 'Edit this page on GitHub',
      link: editLink,
    }
  })
}

const useLastUpdated = (): ComputedRef<null | string> => {
  const siteLocale = useSiteLocaleData()
  const themeLocale = useThemeLocaleData()
  const page = usePageData<DefaultThemePageData>()
  const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()

  return computed(() => {
    const showLastUpdated =
      frontmatter.value.lastUpdated ?? themeLocale.value.lastUpdated ?? true

    if (!showLastUpdated) return null

    if (!page.value.git?.updatedTime) return null

    const updatedDate = new Date(page.value.git?.updatedTime)

    return updatedDate.toLocaleString()
  })
}

const useContributors = (): ComputedRef<null | Required<DefaultThemePageData['git']>['contributors']> => {
  const themeLocale = useThemeLocaleData()
  const page = usePageData<DefaultThemePageData>()
  const frontmatter = usePageFrontmatter<DefaultThemeNormalPageFrontmatter>()

  return computed(() => {
    try {
      const showContributors =
        frontmatter.value.contributors ?? themeLocale.value.contributors ?? true
        
      if (!showContributors) return null

      let retArr = page.value.git?.contributors ?? null;
      let nameArr = [];
      
      if (frontmatter.value.hasOwnProperty('extra_contributors')) {
        const c = frontmatter.value.extra_contributors;
        if (!Array.isArray(c)) nameArr.push(c);
        else for (const i in c) nameArr.push(c[i]);
      }
      
      function convToContr(currentValue) {
        return {
          name: currentValue,
          email: null,
          commits: 0,
        };
      };
      
      return [...retArr, ...nameArr.map(convToContr)];
    } catch {
      return null;
    }
  })
}

const themeLocale = useThemeLocaleData()
const editNavLink = useEditNavLink()
const lastUpdated = useLastUpdated()
const contributors = useContributors()
</script>
