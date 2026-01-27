const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const API_BASE = "/api";

let sellers = [];
let bags = [];
let products = [];
let reports = [];
let filteredProducts = [];
let deferredPrompt = null;

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
        <span>${seller.region ?? "—"}</span>
        <span>${seller.phone ?? "Sem contato"}</span>
      </div>
      <span class="tag neutral">Ativa</span>
    `;
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("seller-form"), {
        id: seller.id,
        name: seller.name,
        cpf: seller.cpf,
        region: seller.region ?? "",
        phone: seller.phone,
        address: seller.address,
        gps_point: seller.gps_point,
      });
      openModal("seller", "Dados da vendedora");
    });
    container.appendChild(card);
  });
}

function renderBags() {
  const container = document.getElementById("bag-list");
  if (!container) return;
  container.innerHTML = "";
  bags.forEach((bag) => {
    const seller = sellers.find((entry) => entry.id === bag.seller_id);
    const totalItems = bag.items?.reduce(
      (sum, item) => sum + (item.quantity_sent || 0),
      0,
    );
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
        <span>${totalItems ?? 0} itens</span>
        <span>Venc: ${formatDate(bag.due_date)}</span>
      </div>
      <div class="mini-meta">
        <span>Vendedora: ${seller?.name ?? "-"}</span>
      </div>
      <span class="tag ${tagClass}">${bag.status}</span>
    `;
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("bag-form"), {
        id: bag.id,
        code: bag.code,
        status: bag.status,
        seller: seller?.name ?? "",
        due: formatDate(bag.due_date),
        items: totalItems ?? 0,
      });
      renderBagItems(bag.items ?? []);
      openModal("bag", "Detalhes da maleta");
    });
    container.appendChild(card);
  });
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "mini-tile";
    card.innerHTML = `
      <h4>${product.name}</h4>
      <div class="mini-meta">
        <span>${product.category}</span>
        <span>${product.barcode ?? "Sem código"}</span>
      </div>
      <div class="mini-meta">
        <span>Estoque: ${product.stock_qty}</span>
        <span>${currencyFormatter.format(product.price)}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("product-form"), {
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        category: product.category,
        material: product.material ?? "",
        price: product.price,
        stock_qty: product.stock_qty,
      });
      openModal("product", "Produto selecionado");
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
      <h4>Maleta ${report.bag_id}</h4>
      <div class="mini-meta">
        <span>${formatDate(report.created_at)}</span>
        <span>${report.sold_count} vendidos</span>
      </div>
      <p class="muted">${report.summary}</p>
    `;
    card.addEventListener("click", () => {
      setFormValues(document.getElementById("report-form"), {
        id: report.id,
        bag_id: report.bag_id,
        created_at: formatDate(report.created_at),
        sold_count: report.sold_count,
        summary: report.summary,
      });
      openModal("report", "Relatório selecionado");
    });
    container.appendChild(card);
  });
}

function renderBagItems(items) {
  const container = document.getElementById("bag-items-list");
  if (!container) return;
  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = "<span class=\"muted\">Sem itens associados</span>";
    return;
  }
  const header = document.createElement("div");
  header.className = "item-pill header item-row";
  header.innerHTML = "<span>Item</span><span>Env.</span><span>Ret.</span><span>Preço</span>";
  container.appendChild(header);
  items.forEach((item) => {
    const product = products.find((entry) => entry.id === item.product_id);
    const line = document.createElement("div");
    line.className = "item-pill item-row";
    line.innerHTML = `
      <span>${product?.name ?? "Produto"}</span>
      <span>${item.quantity_sent}</span>
      <span>${item.quantity_returned}</span>
      <span>${currencyFormatter.format(product?.price ?? 0)}</span>
    `;
    container.appendChild(line);
  });
}

function openModal(type, title) {
  const overlay = document.getElementById("modal-overlay");
  const titleEl = document.getElementById("modal-title");
  const forms = document.querySelectorAll(".modal-form");
  forms.forEach((form) => {
    form.classList.toggle("active", form.dataset.modal === type);
  });
  titleEl.textContent = title;
  overlay.classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function filterProducts() {
  const query = document.getElementById("product-search")?.value?.toLowerCase() || "";
  filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.material ?? "").toLowerCase().includes(query) ||
      (product.barcode ?? "").toLowerCase().includes(query)
    );
  });
  renderProducts();
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Erro ao carregar ${path}`);
  }
  return response.json();
}

async function loadData() {
  try {
    const [sellersData, productsData, bagsData, reportsData] = await Promise.all([
      fetchJson("/sellers"),
      fetchJson("/products"),
      fetchJson("/bags"),
      fetchJson("/closing/reports"),
    ]);
    sellers = sellersData;
    products = productsData;
    filteredProducts = [...products];
    bags = bagsData;
    reports = reportsData;
    renderSellers();
    renderProducts();
    renderBags();
    renderReports();
  } catch (error) {
    console.error(error);
  }
}

function wireFormActions() {
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document.getElementById("modal-overlay")?.addEventListener("click", (event) => {
    if (event.target.id === "modal-overlay") {
      closeModal();
    }
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalType = button.dataset.openModal;
      const title = button.textContent?.trim() ?? "Detalhes";
      const form = document.querySelector(`.modal-form[data-modal="${modalType}"]`);
      resetForm(form);
      if (modalType === "bag") {
        renderBagItems([]);
      }
      openModal(modalType, title);
    });
  });

  document.querySelectorAll(".action-card[data-open-modal]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      const modalType = card.dataset.openModal;
      const title = card.querySelector("h3")?.textContent ?? "Detalhes";
      const form = document.querySelector(`.modal-form[data-modal="${modalType}"]`);
      resetForm(form);
      if (modalType === "bag") {
        renderBagItems([]);
      }
      openModal(modalType, title);
    });
  });

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

  document.getElementById("product-search")?.addEventListener("input", filterProducts);
  document.getElementById("product-search-btn")?.addEventListener("click", filterProducts);
}

function setupInstallPrompt() {
  const installBtn = document.getElementById("install-btn");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installBtn) {
      installBtn.hidden = false;
      installBtn.addEventListener("click", async () => {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.hidden = true;
      });
    }
  });
}

async function submitForm(formId, endpoint) {
  const form = document.getElementById(formId);
  if (!form) return;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const id = payload.id;
  delete payload.id;
  delete payload.created_at;
  delete payload.photo_url;

  if (payload.price) {
    payload.price = Number(payload.price);
  }
  if (payload.stock_qty !== undefined) {
    payload.stock_qty = Number(payload.stock_qty || 0);
  }
  if (payload.sold_count !== undefined) {
    payload.sold_count = Number(payload.sold_count || 0);
  }
  if (payload.bag_id !== undefined) {
    payload.bag_id = Number(payload.bag_id || 0);
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}${endpoint}/${id}` : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar");
  }
  return response.json();
}

function parseDueDate(value) {
  if (!value) return null;
  const [day, month] = value.split("/");
  if (!day || !month) return null;
  const year = new Date().getFullYear();
  return new Date(year, Number(month) - 1, Number(day)).toISOString();
}

function findSellerIdByName(name) {
  if (!name) return null;
  const seller = sellers.find(
    (entry) => entry.name.toLowerCase() === name.toLowerCase(),
  );
  return seller?.id ?? null;
}

function attachFormSubmits() {
  document.getElementById("seller-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitForm("seller-form", "/sellers");
    await loadData();
    closeModal();
  });

  document.getElementById("product-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitForm("product-form", "/products");
    await loadData();
    closeModal();
  });

  document.getElementById("report-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("report-form");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.id) {
      return;
    }
    await submitForm("report-form", "/closing/reports");
    await loadData();
    closeModal();
  });

  document.getElementById("bag-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("bag-form");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const id = payload.id;
    const request = {
      code: payload.code,
      status: payload.status,
      due_date: parseDueDate(payload.due),
      seller_id: findSellerIdByName(payload.seller),
      items: [],
    };
    await fetch(`${API_BASE}/bags${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    await loadData();
    closeModal();
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

setupNavigation();
wireFormActions();
attachFormSubmits();
loadData();
loadSummary();
setupInstallPrompt();
