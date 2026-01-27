const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const sellers = [
  {
    name: "Camila Duarte",
    region: "Zona Norte",
    bags: 2,
    status: "Ativa",
    contact: "(11) 98765-1201",
    address: "Rua das Oliveiras, 120",
    gps: "-23.482, -46.621",
  },
  {
    name: "Bianca Lopes",
    region: "Zona Sul",
    bags: 1,
    status: "Ativa",
    contact: "(11) 98814-3344",
    address: "Av. República, 450",
    gps: "-23.563, -46.654",
  },
  {
    name: "Juliana Reis",
    region: "Centro",
    bags: 1,
    status: "Em rota",
    contact: "(11) 97987-5520",
    address: "Rua do Comércio, 88",
    gps: "-23.548, -46.636",
  },
  {
    name: "Renata Alves",
    region: "Zona Oeste",
    bags: 0,
    status: "Disponível",
    contact: "(11) 98541-0092",
    address: "Rua Guaicurus, 901",
    gps: "-23.526, -46.697",
  },
  {
    name: "Fernanda Dias",
    region: "Zona Leste",
    bags: 2,
    status: "Ativa",
    contact: "(11) 99411-7782",
    address: "Av. Radial Leste, 3020",
    gps: "-23.544, -46.564",
  },
  {
    name: "Larissa Monteiro",
    region: "Zona Norte",
    bags: 1,
    status: "Ativa",
    contact: "(11) 99612-7701",
    address: "Rua Campo Belo, 14",
    gps: "-23.475, -46.633",
  },
  {
    name: "Patricia Souza",
    region: "Centro",
    bags: 0,
    status: "Disponível",
    contact: "(11) 99098-1100",
    address: "Rua 7 de Abril, 19",
    gps: "-23.545, -46.638",
  },
  {
    name: "Marta Santos",
    region: "Zona Sul",
    bags: 1,
    status: "Em rota",
    contact: "(11) 98572-4420",
    address: "Rua Bandeira, 712",
    gps: "-23.589, -46.669",
  },
  {
    name: "Natalia Cruz",
    region: "Zona Oeste",
    bags: 1,
    status: "Ativa",
    contact: "(11) 97771-0920",
    address: "Rua Lapa, 331",
    gps: "-23.514, -46.693",
  },
  {
    name: "Ana Paula Lima",
    region: "Zona Leste",
    bags: 0,
    status: "Disponível",
    contact: "(11) 98220-9901",
    address: "Rua Aricanduva, 1700",
    gps: "-23.566, -46.521",
  },
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

const reports = [
  {
    bag: "MA-001",
    date: "02/11/2025",
    sold: 6,
    summary:
      "Vendas concentradas em anéis banhados. Sugestão: reduzir prata na próxima maleta.",
  },
  {
    bag: "MA-014",
    date: "01/11/2025",
    sold: 8,
    summary:
      "Boa saída de colares de ouro. Recomenda-se incluir mais conjuntos completos.",
  },
  {
    bag: "MA-020",
    date: "30/10/2025",
    sold: 4,
    summary:
      "Baixa conversão em pulseiras. Ajustar mix para peças de maior giro.",
  },
];

function setFormValues(form, values) {
  if (!form) return;
  Object.entries(values).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      field.value = value ?? "";
    }
  });
}

function resetForm(form) {
  if (!form) return;
  form.reset();
}

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
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("seller-form"), {
        name: seller.name,
        region: seller.region,
        contact: seller.contact,
        address: seller.address,
        gps: seller.gps,
        bags: seller.bags,
      });
    });
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
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("bag-form"), {
        code: bag.code,
        status: bag.status,
        seller: bag.seller,
        due: bag.due,
        items: bag.items,
      });
    });
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
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("product-form"), product);
    });
    container.appendChild(card);
  });
}

function renderReports() {
  const container = document.getElementById("report-list");
  if (!container) return;
  container.innerHTML = "";
  reports.forEach((report) => {
    const card = document.createElement("div");
    card.className = "mini-tile";
    card.innerHTML = `
      <h4>Maleta ${report.bag}</h4>
      <div class="mini-meta">
        <span>${report.date}</span>
        <span>${report.sold} vendidos</span>
      </div>
      <p class="muted">${report.summary}</p>
    `;
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("report-form"), report);
    });
    container.appendChild(card);
  });
}

function wireFormActions() {
  document.getElementById("bag-reset")?.addEventListener("click", () => {
    resetForm(document.getElementById("bag-form"));
  });
  document.getElementById("seller-reset")?.addEventListener("click", () => {
    resetForm(document.getElementById("seller-form"));
  });
  document.getElementById("product-reset")?.addEventListener("click", () => {
    resetForm(document.getElementById("product-form"));
  });
  document.getElementById("report-reset")?.addEventListener("click", () => {
    resetForm(document.getElementById("report-form"));
  });

  ["bag-form", "seller-form", "product-form", "report-form"].forEach((id) => {
    const form = document.getElementById(id);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
    });
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
renderReports();
setupNavigation();
wireFormActions();
loadSummary();
