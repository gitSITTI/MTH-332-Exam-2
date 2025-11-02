async function loadSet(moduleNum, mode) {
  const path = `../../data/qbank/${mode}_m${moduleNum}.jsonl`;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const text = await res.text();
  return text.split('\n').filter(Boolean).map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
}

function render(items) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  if (!items.length) { list.textContent = 'No items.'; return; }
  items.forEach((it, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    const h = document.createElement('h3');
    h.textContent = `[${idx + 1}] M${it.module} • ${it.type.toUpperCase()}`;
    const q = document.createElement('p');
    q.textContent = it.question;
    card.appendChild(h);
    card.appendChild(q);
    if (Array.isArray(it.choices) && it.choices.length) {
      const ul = document.createElement('ul');
      ul.className = 'choices';
      it.choices.forEach(c => { const li = document.createElement('li'); li.textContent = c; ul.appendChild(li); });
      card.appendChild(ul);
    }
    const ans = document.createElement('details');
    const sum = document.createElement('summary'); sum.textContent = 'Show answer';
    const body = document.createElement('div');
    const answerIndex = Number(it.answer_index || 0);
    const answer = (Array.isArray(it.choices) ? it.choices[answerIndex] : (answerIndex === 0 ? 'True' : 'False'));
    body.innerHTML = `<strong>Answer:</strong> ${answer}<br><strong>Why:</strong> ${it.explanation || ''}`;
    ans.appendChild(sum); ans.appendChild(body);
    card.appendChild(ans);
    list.appendChild(card);
  });
}

function onReady() {
  const moduleSel = document.getElementById('module');
  const modeSel = document.getElementById('mode');
  const btn = document.getElementById('load');
  btn.addEventListener('click', async () => {
    try {
      const items = await loadSet(moduleSel.value, modeSel.value);
      render(items);
    } catch (e) {
      alert(e.message);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else { onReady(); }


