import { Storage } from './storage.ts';
import type { IBlogPost } from './types.ts';
import { v4 as uuid } from 'uuid';

const storage = new Storage();

/*
const myArray = [
  { title: 'Title 1', author: "Alice", date: "2023-01-01", content: "Content 1" },
  { title: 'Title 2', author: "Bob", date: "2023-01-02", content: "Content 2"  }
];
*/
//storage.save('blogPosts', myArray);

init();

function init() {
  const formEl = document.querySelector('#post-form') as HTMLFormElement;

  formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const newBlogPost: IBlogPost = {
    id: generateId(),
    title: formEl.querySelector<HTMLInputElement>('#post-title')!.value,
    author: formEl.querySelector<HTMLInputElement>('#post-author')!.value,
    date: new Date(),
    content: formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value
  };

  console.log("New blog post:", newBlogPost);

  const newBlogPostEl = createNewBlogPostEl(newBlogPost);
  document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', newBlogPostEl);

  //save
  console.log(storage.save('blogPosts', [...(storage.load('blogPosts') || []), newBlogPost]));
  formEl.reset();
});
  // Load data from storage
  const blogPosts = storage.load('blogPosts');
  console.log("blogPosts:", blogPosts);
  if (blogPosts) {
    // Render blog posts
    blogPosts.forEach((post) => {
      const article = document.createElement('article');
      article.innerHTML = `
        <h2>${post.title}</h2>
        <h3>${post.author}</h3>
        <h4>${post.date}</h4>
        <p>${post.content}</p>
      `;
      document.querySelector('#posts-section')!.prepend(article);
    });
  }


} 
function createNewBlogPostEl(post: IBlogPost): HTMLElement {
  const article = document.createElement('article');
  article.innerHTML = `
    <h2>${post.title}</h2>
    <h3>${post.author}</h3>
    <h4>${post.date}</h4>
    <p>${post.content}</p>
  `;
  return article;
}

function generateId(): string {
  return uuid();
}

/* TODO old code that serve as a reference right now.
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { Storage } from './storage.ts'

const storage = new Storage();
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
*/
