import { Storage } from './storage.class.ts';
import { type IBlogPost } from './types.ts';
import { v4 as uuid } from 'uuid';

//This will be used in functions.
const storage = new Storage('blogPosts');
const formEl = document.querySelector('#post-form') as HTMLFormElement;
const postSection = document.querySelector<HTMLElement>('#posts-section');
let blogPosts: IBlogPost[] = [];
let editPostId: string ='';
//const sampleData = [{"id":"119cb0bc-71e9-4f36-8891-82a5b85b509c","title":"Måndag","author":"Jimmy","date":"2025-08-15T12:50:21.901Z","content":"Privat blogg – ny vecka, samma noll besökare."},{"id":"152cb267-4eb3-4d5f-8f38-b09e7d2de199","title":"Tisdag","author":"Jimmy","date":"2025-08-15T12:50:44.182Z","content":"LocalStorage-tisdag – där mina hemlisar tar en fikapaus."},{"id":"f8fdfceb-70d8-4e8c-b90e-b790c9723815","title":"Onsdag","author":"Jimmy","date":"2025-08-15T12:51:01.806Z","content":"Mitt-i-veckan-uppdatering: fortfarande ohackbar, fortfarande oläst."},{"id":"42b579d1-96d2-43d2-beb2-e129347d3d94","title":"Torsdag","author":"Jimmy","date":"2025-08-15T12:51:19.216Z","content":"Torsdagar är för tankar som ingen annan någonsin får se."},{"id":"826aacfc-3813-4ed8-9ea4-1d69e36d94ac","title":"Fredag","author":"Jimmy","date":"2025-08-15T12:51:34.377Z","content":"Privat blogg-fredag – för molnet kan inte festa som vi."},{"id":"04924f8b-8fb7-4ed1-85fb-1220a1348eb9","title":"Lördag","author":"Jimmy","date":"2025-08-15T12:51:55.834Z","content":"Helgläge: offline, osynlig, oövervinnerlig."},{"id":"1dde65e3-7233-4961-a50f-fe1acdcd1ff3","title":"Söndag","author":"Jimmy","date":"2025-08-15T12:52:13.779Z","content":"Privat blogg-söndag – min datas vilodag."}];

init();

function init() : void {
  formEl.addEventListener('submit', (e) => onSubmitHandler(e));
  postSection?.addEventListener('click', (e) => onPostSectionClick(e));
  formEl.querySelector('.cancel-post-button')!.addEventListener('click', () => {
    formEl.reset();
    editPostId = '';
    formEl.querySelector('.create-post-button')!.textContent = 'Add';
  });
  formEl.querySelector('.create-post-button')!.textContent = 'Add';

  loadData();
}

function onPostSectionClick(e: MouseEvent): void {
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

  storage.save(blogPosts);
  formEl.reset();
  editPostId = '';
  formEl.querySelector('.create-post-button')!.textContent = 'Add';
}


function AddPost(){
  const newBlogPost: IBlogPost = {
    id: generateId(),
    title: formEl.querySelector<HTMLInputElement>('#post-title')!.value,
    author: formEl.querySelector<HTMLInputElement>('#post-author')!.value,
    date: new Date(),
    content: formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value
  };

  //Add to array
  blogPosts.unshift(newBlogPost);

  //Add to DOM
  const newBlogPostEl = createNewBlogPostEl(newBlogPost);
  document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', newBlogPostEl);

  //save
  saveData(newBlogPost);
}

function saveData(newPost : IBlogPost) : void{
  storage.save([...(storage.load() || []), newPost]);
  formEl.reset();
}

function loadData() {
  //There may be no blog posts
  blogPosts = storage.load() || [];
  //Load sample data if there are no posts
  if (blogPosts.length === 0) {
    blogPosts = [
      {
        id: generateId(),
        title: 'Sample Post 1',
        author: 'Author 1',
        date: new Date(),
        content: 'This is the content of a sample post.\n\nDelete it!'
      }
    ];
  }

  blogPosts.forEach((post) => {
    const article = createNewBlogPostEl(post);
    document.querySelector('#posts-section')!.insertAdjacentElement('afterbegin', article);
  });
}

function createNewBlogPostEl(post: IBlogPost): HTMLElement {
  const article = document.createElement('article');
  article.setAttribute('data-id', String(post.id));
  article.innerHTML = `
    <h2 class="blog-post-title">${post.title}</h2>
    <h3 class="blog-post-author">Author: ${post.author}</h3>
    <h4 class="blog-post-date">Date: ${getDateString(post.date)}</h4>
    <p class="blog-post-content">${post.content.replace(/\n/g, "<br>")}</p>
    <button class="delete-post-button material-symbols-outlined">delete</button>
    <button class="edit-post-button material-symbols-outlined">edit</button>
  `;
  return article;
}

function getDateString(stringDate : Date) : string {
  const date = new Date(stringDate);
  const datestr =  date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return datestr;
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

  //TODO remove from database
  storage.save(blogPosts);
}

function onEditHandler(target: HTMLElement) {
  const parent = target.parentElement;
  const postId = parent?.dataset.id;
  const post = blogPosts.find(post => post.id == postId);
  if (post) {
    formEl.querySelector<HTMLInputElement>('#post-title')!.value = post.title;
    formEl.querySelector<HTMLInputElement>('#post-author')!.value = post.author;
    formEl.querySelector<HTMLTextAreaElement>('#post-content')!.value = post.content;
    editPostId = String(post.id);
    formEl.querySelector('.create-post-button')!.textContent = 'Update';
  }
}

