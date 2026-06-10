const SUPABASE_URL = "https://mmburkniqjtdpchyotnb.supabase.co/rest/v1/article"; 
const SUPABASE_KEY = "sb_publishable_XdQqpRqF-bCwI7wfSqdmvg_vAuu34Bq";

const articlesContainer = document.getElementById('articles-container');
const addArticleForm = document.getElementById('add-article-form');

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
                ERROR
            </p>
        `;
    }
};

const displayArticles = (articles) => {
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p class="text-gray-500 italic">Brak artykułów w bazie danych.</p>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => `
        <article class="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900 mb-1">${article.title}</h3>
            <h4 class="text-lg font-medium text-indigo-500 mb-3">${article.subtitle}</h4>
            <div class="flex flex-wrap justify-between text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                <address class="not-italic"><strong>Autor:</strong> ${article.author}</address>
                <time datetime="${article.created_at}"><strong>Data utworzenia:</strong> ${new Date(article.created_at).toLocaleString('pl-PL')}</time>
            </div>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed">${article.content}</p>
        </article>
    `).join('');
};

const createNewArticle = async (articleData) => {
    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers: {
                'apiKey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(articleData)
        });

        if (response.status !== 201 && response.status !== 200) {
            throw new Error(`Status: ${response.status}`);
        }

        addArticleForm.reset();
        
        await fetchArticles();
        
        alert('Artykuł został pomyślnie dodany!');

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Wystąpił błąd podczas dodawania artykułu. Spróbuj ponownie.');
    }
};

addArticleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    const newArticle = {
        title: title,
        subtitle: subtitle,
        author: author,
        content: content
    };

    createNewArticle(newArticle);
});

fetchArticles();