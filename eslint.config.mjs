// eslint.config.mjs
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',        // Disallow self-closing like <slot />
          normal: 'never',      // Keep <div></div>, <textarea></textarea>
          component: 'always',  // Enforce self-closing like <pf-avatar />
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
