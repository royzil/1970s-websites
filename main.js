// Helper: Very basic HTML to text extraction for 1970s style
function extractMainContent(html) {
  // Try to get <main>, <article>, or <body> content
  let doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;

  let content = '';
  let main = doc.querySelector('main, article');
  if (main) {
    content = main.innerHTML;
  } else {
    let body = doc.body;
    content = body ? body.innerHTML : '';
  }

  // Remove scripts/styles and most modern markup
  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '');

  // Remove all img tags (simulate text era)
  content = content.replace(/<img[\s\S]*?>/gi, '');

  // Optionally, replace tables with pre/code blocks
  content = content.replace(/<table[\s\S]*?<\/table>/gi, '[Table omitted for 1970s style]');

  return content;
}

// Helper: Apply 1970s flavor
function apply70sFlair(html) {
  // Replace headings with uppercase/retro
  html = html.replace(/<h([1-4])>(.*?)<\/h\1>/gi, (m, lvl, txt) => {
    return `<h${lvl}>${txt.toUpperCase()}</h${lvl}>`;
  });
  // Optionally, more ASCII art or fake terminal could be added
  return html;
}

function showRetro(html) {
  const retroDiv = document.getElementById('retroContent');
  retroDiv.innerHTML = apply70sFlair(html);
}

// Use CORS proxy for fetching (Github Pages can't proxy directly)
const CORS_PROXY = "https://corsproxy.io/?"; // public, or swap to another if needed

document.getElementById('fetchBtn').onclick = async function() {
  const url = document.getElementById('urlInput').value.trim();
  const retroDiv = document.getElementById('retroContent');
  if (!/^https?:\/\//i.test(url)) {
    retroDiv.innerHTML = '<em>Please enter a valid http(s) URL.</em>';
    return;
  }
  retroDiv.innerHTML = '<em>Loading and reimagining...</em>';
  try {
    const resp = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!resp.ok) throw new Error("Fetch failed");
    const html = await resp.text();
    let content = extractMainContent(html);
    if (!content || content.length < 40) {
      content = 'Sorry, could not extract readable content. Try pasting the text instead!';
    }
    showRetro(content);
  } catch (e) {
    retroDiv.innerHTML =
      `<strong>Could not load or process that site.</strong><br>
      (Some sites block cross-origin access. Try another, or paste text manually.)`;
  }
};

document.getElementById('renderTextBtn').onclick = function() {
  const text = document.getElementById('manualText').value.trim();
  if (!text) {
    document.getElementById('retroContent').innerHTML = '<em>Please enter some text.</em>';
    return;
  }
  // Convert simple text to pseudo-70s HTML
  let html = text
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/\n{2,}/g, '<br><br>');
  showRetro(html);
};
