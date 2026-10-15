let allProducts = [];
const grid = document.getElementById('grid');
const loader = document.getElementById('loader');
const filtersContainer = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');

// משיכת נתונים מהקובץ החיצוני (או מסוכן AI בעתיד)
async function initApp() {
    try {
        const response = await fetch('data.json');
        allProducts = await response.json();
        loader.classList.add('hidden');
        grid.classList.remove('hidden');
        
        setupFilters();
        renderProducts(allProducts);
        
        searchInput.addEventListener('input', handleSearch);
    } catch (error) {
        loader.innerText = 'שגיאה בטעינת הנתונים. ודא שהקובץ data.json קיים.';
    }
}

// יצירת כפתורי סינון אוטומטית לפי הקטגוריות הקיימות בנתונים
function setupFilters() {
    const categories = ['הכל', ...new Set(allProducts.map(p => p.category))];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = `px-6 py-2 border-2 border-premium font-bold text-sm transition-colors cursor-pointer sharp-edge ${cat === 'הכל' ? 'bg-premium text-white' : 'bg-transparent text-premium hover:bg-highlight'}`;
        
        btn.addEventListener('click', (e) => {
            // עדכן צבעי כפתורים
            document.querySelectorAll('#filters button').forEach(b => {
                b.classList.remove('bg-premium', 'text-white');
                b.classList.add('bg-transparent', 'text-premium');
            });
            e.target.classList.remove('bg-transparent', 'text-premium');
            e.target.classList.add('bg-premium', 'text-white');
            
            // סנן
            const filtered = cat === 'הכל' ? allProducts : allProducts.filter(p => p.category === cat);
            renderProducts(filtered);
        });
        
        filtersContainer.appendChild(btn);
    });
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term) ||
        p.store.toLowerCase().includes(term)
    );
    renderProducts(filtered);
}

function renderProducts(products) {
    grid.innerHTML = '';
    
    if(products.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    noResults.classList.add('hidden');

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card flex flex-col bg-surface sharp-edge';
        card.innerHTML = `
            <div class="img-container relative h-80 w-full overflow-hidden bg-white border-b-2 border-premium">
                <img src="${p.imageUrl}" alt="${p.title}" class="object-cover w-full h-full">
                <div class="absolute top-0 right-0 bg-premium text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border-b-2 border-l-2 border-premium">
                    ${p.store}
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow justify-between">
                <div>
                    <span class="text-xs text-gray-500 font-bold tracking-widest mb-2 block uppercase">${p.category}</span>
                    <h3 class="font-serif text-2xl font-bold mb-4 leading-tight">${p.title}</h3>
                    <p class="text-sm text-gray-600 mb-4 line-clamp-2">${p.description}</p>
                </div>
                <div class="flex flex-col gap-3 mt-4 pt-4 border-t-2 border-highlight">
                    <div class="text-2xl font-black text-left w-full">${p.price}</div>
                    <a href="${p.affiliateLink}" target="_blank" class="w-full text-center px-6 py-3 bg-premium text-white font-bold hover:bg-white hover:text-premium border-2 border-premium transition-colors text-sm uppercase tracking-wider">
                        לקנייה באתר המקור
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

initApp();