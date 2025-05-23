const NUM_OF_ITEMS_PER_PAGE = 10;
const MAX_ITEMS = 30; // 한 번에 유지할 DOM 최대 개수

let start = 0;
let end = start + NUM_OF_ITEMS_PER_PAGE;
let totalItems = 0;
let topIndex = 0;
let lastScrollY = 0;

const scrollContainer = document.getElementById('scroll-container');

// 아이템 DOM 생성 함수
function createItemElement(text, index) {
  const item = document.createElement('div');
  item.textContent = text;
  item.classList.add('item');
  item.dataset.index = index;
  return item;
}

// 오래된 아이템 제거
function removeExcessItems(direction = 'down') {
  // const items = scrollContainer.querySelectorAll('.item');
  const items = Array.from(scrollContainer.querySelectorAll('.item'));
  console.log('items:', items);
  if (items.length <= MAX_ITEMS) return;

  const excess = items.length - MAX_ITEMS;

  if (direction === 'down') {
    const toRemove = items.slice(0, excess); // 위쪽 제거
    toRemove.forEach(item => scrollContainer.removeChild(item));

    const remaining = scrollContainer.querySelectorAll('.item');
    if (remaining.length > 0) {
      topIndex = parseInt(remaining[0].dataset.index);
    }
  } else if (direction === 'up') {
    for (let i = items.length - 1; i >= 0; i--){
      const rect = items[i].getBoundingClientRect();
      if (rect.top > window.innerHeight + 200) {
        scrollContainer.removeChild(items[i]);
      } else {
        break;
      }
    }
  }
}

// 서버에서 아이템 가져오기
async function fetchItems(start, end) {
  const res = await fetch(`/get-items?start=${start}&end=${end}`);
  return res.json();
}

async function loadItems(direction = 'down') {
  if (direction === 'down') {
    if (start >= totalItems) return;

    const data = await fetchItems(start, end);
    data.forEach((text, i) => {
      const item = createItemElement(text, start + i);
      scrollContainer.appendChild(item);
    });

    removeExcessItems('down');

    start = end;
    end += NUM_OF_ITEMS_PER_PAGE;

  } else if (direction === 'up') {
    if(topIndex <= 0) return;

    const newEnd = topIndex;
    const newStart = Math.max(0, newEnd - NUM_OF_ITEMS_PER_PAGE);
    const data = await fetchItems(newStart, newEnd);

    const fragment = document.createDocumentFragment();
    data.forEach((text, i) => {
      const item = createItemElement(text, newStart + i);
      fragment.appendChild(item);
    });

    scrollContainer.prepend(fragment);
    topIndex = newStart;

    removeExcessItems('up');
  }
}

// 전체 item 개수 가져오기
async function getTotal() {
  const res = await fetch('/get-total');
  const json = await res.json();
  totalItems = json.total;
}

document.addEventListener('DOMContentLoaded', async () => {
  await getTotal();
  loadItems();
});

// 스크롤 이벤트 핸들링
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;
  const isScrollingUp = currentScrollY < lastScrollY;

  const endOfScroll =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 1;
  
  if (endOfScroll && isScrollingDown) {
    loadItems('down');
  } else if (isScrollingUp && currentScrollY < 200) {
    loadItems('up');
  }

  lastScrollY = currentScrollY;
})