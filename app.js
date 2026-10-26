const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  const remaining = todos.filter((t) => !t.done).length;
  countEl.textContent = `남은 할 일: ${remaining}개`;
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = todo.done;
    check.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.textContent = '삭제';
    del.className = 'delete';
    del.addEventListener('click', () => deleteTodo(todo.id));

    li.append(check, text, del);
    list.appendChild(li);
  });
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  save();
  render();
}

function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = '';
  input.focus();
});

render();

const copyBtn = document.getElementById('copy-btn');
let copyTimer;

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // file:// 등 비보안 컨텍스트용 폴백
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
}

function flashCopyBtn(label) {
  copyBtn.textContent = label;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => { copyBtn.textContent = '복사'; }, 1500);
}

copyBtn.addEventListener('click', () => {
  if (!todos.length) return flashCopyBtn('비어 있음');
  const text = todos.map((t) => `[${t.done ? 'x' : ' '}] ${t.text}`).join('\n');
  copyText(text).then(() => flashCopyBtn('복사됨!'), () => flashCopyBtn('실패'));
});

const themeBtn = document.getElementById('theme-toggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function isDark() {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : darkQuery.matches;
}

function updateThemeBtn() {
  themeBtn.textContent = isDark() ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeBtn();
});

darkQuery.addEventListener('change', updateThemeBtn);
updateThemeBtn();
