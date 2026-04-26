import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

const el = document.getElementById('jekyll-ttrpg-catalog-app')

if (el) {
  const baseurl = el.dataset.baseurl ?? ''
  const postsPerPage = parseInt(el.dataset.postsPerPage ?? '24', 10)

  mount(App, {
    target: el,
    props: { baseurl, postsPerPage },
  })
}
