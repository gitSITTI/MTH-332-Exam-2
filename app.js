(function () {
  const STORAGE_KEY = 'mth332_notes_v1';

  /**
   * @typedef {{ id: string, title: string, content: string, createdAt: number, updatedAt: number }} Note
   */

  /** @returns {Note[]} */
  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  /** @param {Note[]} notes */
  function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  /** @param {Note} note */
  function noteItemTemplate(note) {
    const li = document.createElement('li');
    li.className = 'note';
    li.dataset.id = note.id;

    const header = document.createElement('div');
    header.className = 'note-header';
    const title = document.createElement('h3');
    title.textContent = note.title;
    const actions = document.createElement('div');
    actions.className = 'note-actions';
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'secondary';
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';

    header.appendChild(title);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    header.appendChild(actions);

    const body = document.createElement('p');
    body.textContent = note.content;

    const meta = document.createElement('div');
    meta.className = 'note-meta';
    const updated = new Date(note.updatedAt).toLocaleString();
    meta.textContent = `Updated: ${updated}`;

    li.appendChild(header);
    li.appendChild(body);
    li.appendChild(meta);

    // Behaviors
    delBtn.addEventListener('click', () => {
      const notes = loadNotes().filter(n => n.id !== note.id);
      saveNotes(notes);
      renderNotes();
    });

    editBtn.addEventListener('click', () => {
      const newTitle = prompt('Edit title:', note.title);
      if (newTitle === null) return;
      const newContent = prompt('Edit content:', note.content);
      if (newContent === null) return;
      const notes = loadNotes();
      const idx = notes.findIndex(n => n.id === note.id);
      if (idx !== -1) {
        notes[idx] = { ...notes[idx], title: newTitle.trim(), content: newContent.trim(), updatedAt: Date.now() };
        saveNotes(notes);
        renderNotes();
      }
    });

    return li;
  }

  function renderNotes() {
    const container = document.getElementById('notes');
    if (!container) return;
    container.innerHTML = '';
    const notes = loadNotes();
    if (!notes.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'No notes yet.';
      container.appendChild(empty);
      return;
    }
    notes
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .forEach(note => container.appendChild(noteItemTemplate(note)));
  }

  function onReady() {
    const form = document.getElementById('note-form');
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const clearBtn = document.getElementById('clear-all');
    const exportBtn = document.getElementById('export');
    const importInput = document.getElementById('import');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const t = /** @type {HTMLInputElement} */ (title).value.trim();
        const c = /** @type {HTMLTextAreaElement} */ (content).value.trim();
        if (!t || !c) return;
        const now = Date.now();
        const note = { id: uid(), title: t, content: c, createdAt: now, updatedAt: now };
        const notes = loadNotes();
        notes.push(note);
        saveNotes(notes);
        /** @type {HTMLInputElement} */ (title).value = '';
        /** @type {HTMLTextAreaElement} */ (content).value = '';
        renderNotes();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all notes?')) {
          saveNotes([]);
          renderNotes();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const data = JSON.stringify(loadNotes(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }

    if (importInput) {
      importInput.addEventListener('change', async () => {
        const file = importInput.files && importInput.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const arr = JSON.parse(text);
          if (!Array.isArray(arr)) throw new Error('Invalid file');
          saveNotes(arr);
          renderNotes();
        } catch (err) {
          alert('Import failed. Ensure this is a valid notes.json file.');
        } finally {
          importInput.value = '';
        }
      });
    }

    renderNotes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();


