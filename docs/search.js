const Fuse = globalThis.Fuse;

const searchInput = document.querySelector('#searchbar');
const contentDiv = document.querySelector('#content');
const searchResultsDiv = document.querySelector('#searchResults');
const currentFile =
  document.querySelector("meta[name='doc-current-file']").attributes
    .getNamedItem('content').value;
const pathToRoot = '../'.repeat(
  currentFile ? (currentFile.split('/').length + 1) : 0,
);
searchInput.removeAttribute('style');

const SEARCH_INDEX = globalThis.DENO_DOC_SEARCH_INDEX;

const fuse = new Fuse(SEARCH_INDEX.nodes, {
  keys: [{
    name: 'name',
    weight: 2,
  }],
  isCaseSensitive: false,
  minMatchCharLength: 2,
  threshold: 0.4,
});

const loadedUrl = new URL(globalThis.location.href);
const val = loadedUrl.searchParams.get('q');
if (val) {
  searchInput.value = val;
  doSearch(val);
}

globalThis.addEventListener('load', function () {
  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 's') {
      if (event.target !== searchInput) {
        searchInput.focus();
        event.preventDefault();
      }
    }
  });

  const emptyPlaceholder = "Click or press 'S' to search...";
  searchInput.placeholder = emptyPlaceholder;

  searchInput.addEventListener('focus', function () {
    searchInput.placeholder = 'Type your query here...';
  });

  searchInput.addEventListener('blur', function () {
    searchInput.placeholder = emptyPlaceholder;
  });
});

function debounce(func, delay) {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);

    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

const debouncedSearch = debounce(doSearch, 250);

searchInput.addEventListener('input', (e) => {
  const val = e.target.value;
  debouncedSearch(val);
});

function doSearch(val) {
  if (!val) {
    updateCurrentLocation(val);
    showPage();
  } else {
    const results = searchInIndex(val);
    // console.log("results", results);
    updateCurrentLocation(val);
    renderResults(results);
    showSearchResults();
  }
}

function updateCurrentLocation(val) {
  const url = new URL(globalThis.location.href);
  if (val) {
    url.searchParams.set('q', val);
  } else {
    url.searchParams.delete('q');
  }
  globalThis.history.replaceState({}, '', url.href);
}

function showPage() {
  contentDiv.style.display = 'flex';
  searchResultsDiv.style.display = 'none';
}

function showSearchResults() {
  contentDiv.style.display = 'none';
  searchResultsDiv.style.display = 'block';
}

function renderResults(results) {
  if (results.length === 0) {
    searchResultsDiv.innerHTML = `<span>No result</span>`;
    return;
  }

  let html = `<ul>`;

  for (const result of results) {
    const kind = result.kind.map((kind) => {
      return `<div class="text-${kind.kind} bg-${kind.kind}/15 dark:text-${kind.kind}Dark dark:bg-${kind.kind}Dark/15" title="${kind.title}">${kind.char}</div>`;
    }).join('');

    html += `<li class="block">
<a href="${pathToRoot}${result.file}/~/${result.name}.html" class="flex rounded-lg gap-4 items-center justify-between py-2 px-3 hover:bg-stone-100 dark:hover:bg-stone-800">
    <div class="flex items-center gap-2.5">
      <div class="docNodeKindIcon">
        ${kind}
      </div>
      <span class="text-sm leading-none">${result.name}</span>
    </div>
</a>
</li>`;
  }

  html += `</ul>`;
  searchResultsDiv.innerHTML = html;
}

function searchInIndex(val) {
  return fuse.search(val).map((result) => result.item);
}
