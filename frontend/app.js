const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const sellers = [
  { name: "Camila Duarte", region: "Zona Norte", bags: 2, status: "Ativa" },
  { name: "Bianca Lopes", region: "Zona Sul", bags: 1, status: "Ativa" },
  { name: "Juliana Reis", region: "Centro", bags: 1, status: "Em rota" },
  { name: "Renata Alves", region: "Zona Oeste", bags: 0, status: "Disponível" },
  { name: "Fernanda Dias", region: "Zona Leste", bags: 2, status: "Ativa" },
  { name: "Larissa Monteiro", region: "Zona Norte", bags: 1, status: "Ativa" },
  { name: "Patricia Souza", region: "Centro", bags: 0, status: "Disponível" },
  { name: "Marta Santos", region: "Zona Sul", bags: 1, status: "Em rota" },
  { name: "Natalia Cruz", region: "Zona Oeste", bags: 1, status: "Ativa" },
  { name: "Ana Paula Lima", region: "Zona Leste", bags: 0, status: "Disponível" },
];

const bags = [
  {
    code: "MA-001",
    status: "Em campo",
    seller: "Camila Duarte",
    due: "03/11",
    items: 18,
  },
  {
    code: "MA-014",
    status: "Aguardando",
    seller: "Bianca Lopes",
    due: "05/11",
    items: 22,
  },
  {
    code: "MA-020",
    status: "Em campo",
    seller: "Fernanda Dias",
    due: "07/11",
    items: 16,
  },
  { code: "MA-031", status: "Disponível", seller: "-", due: "-", items: 0 },
  { code: "MA-032", status: "Disponível", seller: "-", due: "-", items: 0 },
];

const categories = [
  "Anéis",
  "Colares",
  "Pulseiras",
  "Brincos",
  "Pingentes",
];

const materials = ["Ouro", "Prata", "Banhado"];

const products = Array.from({ length: 50 }, (_, index) => {
  const category = categories[index % categories.length];
  const material = materials[index % materials.length];
  return {
    name: `${category} ${index + 1}`,
    category,
    material,
    price: (120 + index * 7.5).toFixed(2),
    sku: `PRD-${String(index + 1).padStart(3, "0")}`,
  };
});

function renderSellers() {
  const container = document.getElementById("seller-list");
  if (!container) return;
  container.innerHTML = "";
  sellers.forEach((seller) => {
    const card = document.createElement("div");
    card.className = "mini-tile";
    card.innerHTML = `
      <h4>${seller.name}</h4>
      <div class="mini-meta">
        <span>${seller.region}</span>
        <span>${seller.bags} maleta(s)</span>
      </div>
      <span class="tag neutral">${seller.status}</span>
    `;
    container.appendChild(card);
  });
}

function renderBags() {
  const container = document.getElementById("bag-list");
  if (!container) return;
  container.innerHTML = "";
  bags.forEach((bag) => {
    const tagClass =
      bag.status === "Em campo"
        ? "success"
        : bag.status === "Aguardando"
        ? "warning"
        : "neutral";
    const card = document.createElement("div");
    card.className = "mini-tile";
    card.innerHTML = `
      <h4>${bag.code}</h4>
      <div class="mini-meta">
        <span>${bag.items} itens</span>
        <span>Venc: ${bag.due}</span>
      </div>
      <div class="mini-meta">
        <span>Vendedora: ${bag.seller}</span>
      </div>
      <span class="tag ${tagClass}">${bag.status}</span>
    `;
    container.appendChild(card);
  });
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "mini-tile";
    card.innerHTML = `
      <h4>${product.name}</h4>
      <div class="mini-meta">
        <span>${product.category}</span>
        <span>${product.material}</span>
      </div>
      <div class="mini-meta">
        <span>${product.sku}</span>
        <span>${currencyFormatter.format(product.price)}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".tab-panel");

  function activate(tab) {
    navButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.tab === tab);
    });
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activate(button.dataset.tab);
    });
  });

  activate("inicio");
}

async function loadSummary() {
  try {
    const response = await fetch("/api/dashboard/summary");
    if (!response.ok) {
      throw new Error("Erro ao carregar resumo");
    }
    const data = await response.json();

    document.getElementById("region-leader").textContent = data.region_leader;
    document.getElementById("month-sales").textContent = currencyFormatter.format(
      data.month_sales,
    );
    document.getElementById("ai-status-pill").textContent = data.pending_ai_analysis
      ? "IA pendente"
      : "IA pronta";
    document.getElementById("bags-active").textContent =
      data.upcoming_closings.length;

    const list = document.getElementById("upcoming-closings");
    list.innerHTML = "";
    if (data.upcoming_closings.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Nenhum fechamento próximo";
      list.appendChild(item);
    } else {
      data.upcoming_closings.forEach((code) => {
        const item = document.createElement("li");
        item.textContent = `${code} • em breve`;
        list.appendChild(item);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

renderSellers();
renderBags();
renderProducts();
setupNavigation();
loadSummary();
