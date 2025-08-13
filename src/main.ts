import { Storage } from './storage.ts';
import { type IBlogPost } from './types.ts';
import { v4 as uuid } from 'uuid';

//This will be used in functions.
const storage = new Storage();
const formEl = document.querySelector('#post-form') as HTMLFormElement;
const postSection = document.querySelector<HTMLElement>('#posts-section');
let blogPosts: IBlogPost[] = [];
const PostState = {
  Add: 'add',
  Edit: 'edit',
};

let ps = PostState.Add;
let editPostId: string ='';

init();

console.log(blogPosts);

//throw new Error('Function not implemented.');

function init() : void {
  formEl.addEventListener('submit', (e) => onSubmitHandler(e));
  postSection?.addEventListener('click', (e) => onPostSectionClick(e));
  loadData();
}

function onPostSectionClick(e: PointerEvent): void {
 const target = e.target as HTMLElement;
 if (target.classList.contains('delete-post-button')) {
   onDeleteHandler(target);
 } else if (target.classList.contains('edit-post-button')) {
   onEditHandler(target);
 }
}

function onSubmitHandler(e: Event) {
  e.preventDefault();

  //Are we editing an existing post?
  if (editPostId) {
    EditPost(editPostId);
  } else {
    AddPost();
  }
};

function EditPost(id : string) : void{

  const post = blogPosts.find(post => post.id === id);
  
  //Ensure postSection and post are defined
  if (!post || !postSection) return;

  post.title = formEl.querySelector<HTMLInputElement>('#post-title')!.value;
  post.author = formEl.querySelector<HTMLInputElement>('#post-author')!.value;
  post.content = formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value;

  postSection.querySelector<HTMLElement>(`article[data-id="${id}"]`)?.replaceWith(createNewBlogPostEl(post));

  storage.save('blogPosts', blogPosts);
  formEl.reset();
  editPostId = '';
}


function AddPost(){
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
  //storage.save('blogPosts', [...(storage.load('blogPosts') || []), newBlogPost]);
  saveData(newBlogPost);
  
}

function saveData(newPost : IBlogPost){
  storage.save('blogPosts', [...(storage.load('blogPosts') || []), newPost]);
  formEl.reset();
}

function loadData() {
  //There may be no blog posts
  blogPosts = storage.load('blogPosts') || [];
  if (blogPosts) {
    blogPosts.forEach((post) => {
      const article = createNewBlogPostEl(post);
      document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', article);
    });
  }
} 

function createNewBlogPostEl(post: IBlogPost): HTMLElement {
  const article = document.createElement('article');
  article.setAttribute('data-id', String(post.id));
  article.innerHTML = `
    <h2>${post.title}</h2>
    <h3>${post.author}</h3>
    <h4>${post.date}</h4>
    <p>${post.content}</p>
    <button class="delete-post-button material-symbols-outlined">delete</button>
    <button class="edit-post-button material-symbols-outlined">edit</button>
  `;
  return article;
}

function generateId(): string { 
  return uuid(); 
}

function onDeleteHandler(target: HTMLElement) {
  const postId = target.parentElement?.dataset.id;
  //Remove from DOM
  target.parentElement?.remove();
  //Remove from Array
  blogPosts = blogPosts.filter(post => post.id !== postId);
  console.log(blogPosts);
  //TODO remove from database
  storage.save('blogPosts', blogPosts);
}

function onEditHandler(target: HTMLElement) {
  const parent = target.parentElement;
  ps = PostState.Edit;
  const postId = parent?.dataset.id;
  const post = blogPosts.find(post => post.id === postId);
  if (post) {
    formEl.querySelector<HTMLInputElement>('#post-title')!.value = post.title;
    formEl.querySelector<HTMLInputElement>('#post-author')!.value = post.author;
    formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value = post.content;
    editPostId = String(post.id);
  }
}

