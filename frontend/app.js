const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

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
    document.getElementById("ai-status").textContent = data.pending_ai_analysis
      ? "Há análises pendentes"
      : "Pronto para nova análise";

    const list = document.getElementById("upcoming-closings");
    list.innerHTML = "";
    if (data.upcoming_closings.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Nenhum fechamento próximo";
      list.appendChild(item);
    } else {
      data.upcoming_closings.forEach((code) => {
        const item = document.createElement("li");
        item.textContent = code;
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

loadSummary();
