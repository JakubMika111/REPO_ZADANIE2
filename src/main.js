const SUPABASE_URL = "https://mmburkniqjtdpchyotnb.supabase.co/rest/v1/KOLUMNA1"; 
const SUPABASE_KEY = "sb_publishable_XdQqpRqF-bCwI7wfSqdmvg_vAuu34Bq";

// Pobranie elementów z drzewa DOM
const articlesContainer = document.getElementById('articles-container');
const addArticleForm = document.getElementById('add-article-form');

/**
 * 1. Pobieranie listy artykułów (Zapytanie GET)
 * Wzorowane na slajdzie 22 z prezentacji "Zapytania sieciowe"
 */
const fetchArticles = async () => {
    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'GET',
            headers: {
                'apiKey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd pobierania danych: ${response.status}`);
        }

        const data = await response.json();
        displayArticles(data);
    } catch (error) {
        console.error('Fetch error:', error);
        articlesContainer.innerHTML = `
            <p class="text-red-500 font-medium bg-red-50 p-4 rounded-md border border-red-200">
                Wystąpił błąd podczas ładowania artykułów. Upewnij się, że klucze API w pliku script.js są poprawne.
            </p>
        `;
    }
};

/**
 * Funkcja pomocnicza generująca kod HTML dla pobranych artykułów
 */
const displayArticles = (articles) => {
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p class="text-gray-500 italic">Brak artykułów w bazie danych.</p>';
        return;
    }

    // Mapowanie tablicy artykułów na elementy HTML
    articlesContainer.innerHTML = articles.map(article => `
        <article class="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-1">${article.title}</h3>
            <h4 class="text-lg font-medium text-indigo-500 mb-3">${article.subtitle}</h4>
            <div class="flex flex-wrap justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                <span><strong>Autor:</strong> ${article.author}</span>
                <span><strong>Data utworzenia:</strong> ${new Date(article.created_at).toLocaleString('pl-PL')}</span>
            </div>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">${article.content}</p>
        </article>
    `).join('');
};

/**
 * 2. Wysyłanie nowego artykułu (Zapytanie POST)
 * Wzorowane na slajdzie 23 z prezentacji "Zapytania sieciowe"
 */
const createNewArticle = async (articleData) => {
    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers: {
                'apiKey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' // Opcjonalne: optymalizuje zapytanie w Supabase (zwraca pustą odpowiedź zamiast całego obiektu)
            },
            body: JSON.stringify(articleData)
        });

        // Walidacja kodu statusu 201 Created zgodnie z prezentacją
        if (response.status !== 201 && response.status !== 200) {
            throw new Error(`Status: ${response.status}`);
        }

        // Czyszczenie pól formularza po udanym zapisie
        addArticleForm.reset();
        
        // Ponowne zaciągnięcie aktualnej listy z bazy danych
        await fetchArticles();
        
        alert('Artykuł został pomyślnie dodany do Supabase!');

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Wystąpił błąd podczas dodawania artykułu. Spróbuj ponownie.');
    }
};

/**
 * Nasłuchiwanie na wysłanie formularza przez użytkownika
 */
addArticleForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Zablokowanie domyślnego przeładowania strony

    // Pobranie wartości wprowadzonych w pola input
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    // Zbudowanie obiektu z zachowaniem dokładnych nazw kolumn
    const newArticle = {
        title: title,
        subtitle: subtitle,
        author: author,
        content: content
    };

    // Wywołanie funkcji wysyłającej dane do API
    createNewArticle(newArticle);
});

// Uruchomienie automatycznego pobierania danych zaraz po załadowaniu skryptu
fetchArticles();