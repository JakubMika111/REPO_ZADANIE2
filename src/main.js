const SUPABASE_URL = "https://mmburkniqjtdpchyotnb.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_XdQqpRqF-bCwI7wfSqdmvg_vAuu34Bq";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const articlesContainer = document.getElementById('articles-container');
const articleForm = document.getElementById('article-form');

// 2. FUNKCJA POBIERAJĄCA ARTYKUŁY Z BAZY
async function fetchArticles() {
    const { data, error } = await supabase
        .from('KOLUMNA1')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Błąd pobierania danych:", error);
        articlesContainer.innerHTML = '<p class="text-red-500">Nie udało się załadować artykułów.</p>';
        return;
    }

    // Sprawdzenie, czy baza nie jest pusta
    if (data.length === 0) {
        articlesContainer.innerHTML = '<p class="text-gray-500 italic">Brak artykułów do wyświetlenia.</p>';
        return;
    }

    // Czyszczenie napisu "Ładowanie..." przed wstawieniem artykułów
    articlesContainer.innerHTML = '';

    // Renderowanie każdego artykułu z osobna
    data.forEach(article => {
        // Formatowanie daty na czytelny dla nas format (DD.MM.YYYY)
        const date = new Date(article.created_at).toLocaleDateString('pl-PL');

        // Konstruowanie wyglądu pojedynczego artykułu
        const articleHTML = `
            <article class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 class="text-2xl font-bold text-gray-900 mb-1">${article.title}</h3>
                <h4 class="text-lg text-gray-600 mb-3">${article.subtitle}</h4>
                <div class="text-xs text-gray-400 mb-4">
                    Autor: <span class="font-medium text-gray-600">${article.author}</span> | Data: ${date}
                </div>
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">${article.content}</p>
            </article>
        `;
        
        articlesContainer.innerHTML += articleHTML;
    });
}

// 3. OBSŁUGA WYSYŁANIA FORMULARZA (DODAWANIE NOWEGO ARTYKUŁU)
articleForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Blokujemy domyślne przeładowanie strony po kliknięciu przycisku

    // Pobranie wartości wpisanych przez użytkownika w formularzu
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    // Wysłanie paczki danych do tabeli w Supabase
    const { error } = await supabase
        .from('KOLUMNA1')
        .insert([
            { title: title, subtitle: subtitle, author: author, content: content }
        ]);

    if (error) {
        console.error("Błąd podczas dodawania wpisu:", error);
        alert("Wystąpił błąd podczas dodawania artykułu.");
    } else {
        // Jeśli wszystko się udało: czyścimy formularz i odświeżamy listę, by zobaczyć nowy wpis
        articleForm.reset();
        fetchArticles();
    }
});

// Uruchomienie pobierania danych zaraz po wejściu na stronę
fetchArticles();