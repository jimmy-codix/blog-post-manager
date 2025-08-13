import { Storage } from './storage.ts';
import type { IBlogPost } from './types.ts';
import { v4 as uuid } from 'uuid';

//This will be used in functions.
const storage = new Storage();
const formEl = document.querySelector('#post-form') as HTMLFormElement;

init();

function init() {
  formEl.addEventListener('submit', (e) => onSubmitHandler(e));
  loadData();
}

function onSubmitHandler(e: Event) {
  e.preventDefault();

  const newBlogPost: IBlogPost = {
    id: generateId(),
    title: formEl.querySelector<HTMLInputElement>('#post-title')!.value,
    author: formEl.querySelector<HTMLInputElement>('#post-author')!.value,
    date: new Date(),
    content: formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value
  };

  const newBlogPostEl = createNewBlogPostEl(newBlogPost);
  document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', newBlogPostEl);

  //save
  storage.save('blogPosts', [...(storage.load('blogPosts') || []), newBlogPost]);
  formEl.reset();
};

function loadData() {
  const blogPosts = storage.load('blogPosts');
  if (blogPosts) {
    blogPosts.forEach((post) => {
      const article = createNewBlogPostEl(post);
      document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', article);
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
