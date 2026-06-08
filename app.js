const STORAGE_KEY = "monotributo-control-2026";

const categories = [
  { cat: "A", income: 10277988.13, surface: 30, energy: 3330, rent: 2390229.8, servicesTax: 4780.46, salesTax: 4780.46, sipa: 15616.17, health: 21990.11, serviceFee: 42386.74, salesFee: 42386.74 },
  { cat: "B", income: 15058447.71, surface: 45, energy: 5000, rent: 2390229.8, servicesTax: 9082.88, salesTax: 9082.88, sipa: 17177.79, health: 21990.11, serviceFee: 48250.78, salesFee: 48250.78 },
  { cat: "C", income: 21113696.52, surface: 60, energy: 6700, rent: 3266647.39, servicesTax: 15616.17, salesTax: 14341.38, sipa: 18895.57, health: 21990.11, serviceFee: 56501.85, salesFee: 55227.06 },
  { cat: "D", income: 26212853.42, surface: 85, energy: 10000, rent: 3266647.39, servicesTax: 25495.79, salesTax: 23742.95, sipa: 20785.13, health: 26133.18, serviceFee: 72414.1, salesFee: 70661.26 },
  { cat: "E", income: 30833964.37, surface: 110, energy: 13000, rent: 4143064.98, servicesTax: 47804.6, salesTax: 37924.98, sipa: 22863.64, health: 31869.73, serviceFee: 102537.97, salesFee: 92658.35 },
  { cat: "F", income: 38642048.36, surface: 150, energy: 16500, rent: 4143064.98, servicesTax: 67245.13, salesTax: 49398.08, sipa: 25150, health: 36650.19, serviceFee: 129045.32, salesFee: 111198.27 },
  { cat: "G", income: 46211109.37, surface: 200, energy: 20000, rent: 4939808.23, servicesTax: 122379.76, salesTax: 61189.87, sipa: 35210, health: 39518.47, serviceFee: 197108.23, salesFee: 135918.34 },
  { cat: "H", income: 70113407.33, surface: 200, energy: 20000, rent: 7170689.39, servicesTax: 350567.04, salesTax: 175283.51, sipa: 49294, health: 47485.89, serviceFee: 447346.93, salesFee: 272063.4 },
  { cat: "I", income: 78479211.62, surface: 200, energy: 20000, rent: 7170689.39, servicesTax: 697150.35, salesTax: 278860.14, sipa: 69011.6, health: 58640.31, serviceFee: 824802.26, salesFee: 406512.05 },
  { cat: "J", income: 89872640.3, surface: 200, energy: 20000, rent: 7170689.39, servicesTax: 836580.42, salesTax: 334632.18, sipa: 96616.24, health: 65810.99, serviceFee: 999007.65, salesFee: 497059.41 },
  { cat: "K", income: 108357084.05, surface: 200, energy: 20000, rent: 7170689.39, servicesTax: 1171212.59, salesTax: 390404.2, sipa: 135262.74, health: 75212.57, serviceFee: 1381687.9, salesFee: 600879.51 }
];

const categoryOrder = categories.map((item) => item.cat);
const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

let clients = [];
let settings = { ipc: 2.3 };

const dom = {
  addClientButton: document.getElementById("addClientButton"),
  addClientButtonInline: document.getElementById("addClientButtonInline"),
  importButton: document.getElementById("importButton"),
  exportButton: document.getElementById("exportButton"),
  sampleButton: document.getElementById("sampleButton"),
  clearButton: document.getElementById("clearButton"),
  csvFileInput: document.getElementById("csvFileInput"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  cancelDialogButton: document.getElementById("cancelDialogButton"),
  ipcInput: document.getElementById("ipcInput"),
  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  clientsBody: document.getElementById("clientsBody"),
  emptyState: document.getElementById("emptyState"),
  visibleCount: document.getElementById("visibleCount"),
  categoryGrid: document.getElementById("categoryGrid"),
  dialog: document.getElementById("clientDialog"),
  form: document.getElementById("clientForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  currentCategoryInput: document.getElementById("currentCategoryInput")
};

const fields = {
  id: document.getElementById("clientId"),
  name: document.getElementById("nameInput"),
  cuit: document.getElementById("cuitInput"),
  type: document.getElementById("typeInput"),
  currentCategory: document.getElementById("currentCategoryInput"),
  jan: document.getElementById("janInput"),
  feb: document.getElementById("febInput"),
  mar: document.getElementById("marInput"),
  apr: document.getElementById("aprInput"),
  may: document.getElementById("mayInput"),
  jun: document.getElementById("junInput"),
  surface: document.getElementById("surfaceInput"),
  energy: document.getElementById("energyInput"),
  unitPrice: document.getElementById("unitPriceInput"),
  rent: document.getElementById("rentInput"),
  purchases: document.getElementById("purchasesInput"),
  expenses: document.getElementById("expensesInput"),
  currentFee: document.getElementById("currentFeeInput")
};

function readStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    clients = Array.isArray(parsed.clients) ? parsed.clients : [];
    settings = { ...settings, ...(parsed.settings || {}) };
  } catch {
    clients = [];
  }
}

function writeStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ clients, settings }));
}

function toAmount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function findCategoryByLimit(value, key) {
  if (!value) return null;
  return categories.find((item) => value <= item[key]) || null;
}

function categoryIndex(cat) {
  return categoryOrder.indexOf(cat);
}

function maxCategory(cats) {
  return cats.filter(Boolean).sort((a, b) => categoryIndex(b.cat) - categoryIndex(a.cat))[0] || null;
}

function getFee(cat, type) {
  const category = categories.find((item) => item.cat === cat);
  if (!category) return 0;
  return type === "S" ? category.serviceFee : category.salesFee;
}

function calculateClient(client) {
  const months = ["jan", "feb", "mar", "apr", "may"].map((key) => toAmount(client[key]));
  const juneReal = toAmount(client.jun);
  const june = juneReal || months[4] * (1 + settings.ipc / 100);
  const semester = months.reduce((sum, value) => sum + value, 0) + june;
  const annualized = semester * 2;
  const incomeCategory = findCategoryByLimit(annualized, "income");
  const parameterCategory = maxCategory([
    findCategoryByLimit(toAmount(client.surface), "surface"),
    findCategoryByLimit(toAmount(client.energy), "energy"),
    findCategoryByLimit(toAmount(client.rent), "rent")
  ]);

  const topCategory = categories[categories.length - 1];
  const finalCategory = annualized > topCategory.income ? null : maxCategory([incomeCategory, parameterCategory]);
  const estimatedFee = finalCategory ? getFee(finalCategory.cat, client.type) : 0;
  const currentFee = toAmount(client.currentFee);
  const deltaFee = finalCategory ? estimatedFee - currentFee : null;
  const categoryForExclusion = finalCategory || incomeCategory || topCategory;
  const rentExclusion = toAmount(client.rent) > categoryForExclusion.rent;
  const energyExclusion = toAmount(client.energy) > categoryForExclusion.energy;
  const unitPriceWarning = toAmount(client.unitPrice) > annualized * 0.05 && annualized > 0;
  const reasonability = semester - toAmount(client.purchases) - toAmount(client.expenses) - toAmount(client.rent) / 2 - currentFee * 6;
  const passesRi = !finalCategory || rentExclusion || energyExclusion;

  let status = "mantiene";
  let conclusion = "Mantiene categoria";
  if (passesRi) {
    status = "ri";
    conclusion = "Pasa a Responsable Inscripto";
  } else if (categoryIndex(finalCategory.cat) > categoryIndex(client.currentCategory)) {
    status = "sube";
    conclusion = `Sube: ${client.currentCategory} a ${finalCategory.cat}`;
  } else if (categoryIndex(finalCategory.cat) < categoryIndex(client.currentCategory)) {
    status = "baja";
    conclusion = `Baja: ${client.currentCategory} a ${finalCategory.cat}`;
  }

  if (!passesRi && (unitPriceWarning || reasonability <= 0)) {
    status = status === "mantiene" ? "revisar" : status;
  }

  return {
    june,
    semester,
    annualized,
    incomeCategory: incomeCategory ? incomeCategory.cat : "Excede K",
    parameterCategory: parameterCategory ? parameterCategory.cat : "-",
    finalCategory: finalCategory ? finalCategory.cat : "RI",
    estimatedFee,
    deltaFee,
    rentExclusion,
    energyExclusion,
    unitPriceWarning,
    reasonability,
    status,
    conclusion,
    passesRi
  };
}

function statusClass(status) {
  return {
    sube: "warning",
    baja: "info",
    ri: "danger",
    revisar: "warning",
    mantiene: ""
  }[status] || "";
}

function renderSummary(calculated) {
  const totals = calculated.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.keep += item.result.status === "mantiene" ? 1 : 0;
      acc.up += item.result.status === "sube" ? 1 : 0;
      acc.down += item.result.status === "baja" ? 1 : 0;
      acc.ri += item.result.status === "ri" ? 1 : 0;
      acc.delta += typeof item.result.deltaFee === "number" ? item.result.deltaFee : 0;
      return acc;
    },
    { total: 0, keep: 0, up: 0, down: 0, ri: 0, delta: 0 }
  );

  document.getElementById("metricTotal").textContent = totals.total;
  document.getElementById("metricKeep").textContent = totals.keep;
  document.getElementById("metricUp").textContent = totals.up;
  document.getElementById("metricDown").textContent = totals.down;
  document.getElementById("metricRi").textContent = totals.ri;
  document.getElementById("metricDelta").textContent = money.format(totals.delta);
}

function renderClients() {
  const search = dom.searchInput.value.trim().toLowerCase();
  const status = dom.statusFilter.value;
  const calculated = clients.map((client) => ({ client, result: calculateClient(client) }));
  const visible = calculated.filter(({ client, result }) => {
    const haystack = `${client.name || ""} ${client.cuit || ""}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesStatus = status === "all" || result.status === status;
    return matchesSearch && matchesStatus;
  });

  renderSummary(calculated);
  dom.visibleCount.textContent = `${visible.length} registro${visible.length === 1 ? "" : "s"} visible${visible.length === 1 ? "" : "s"}`;
  dom.emptyState.style.display = clients.length ? "none" : "block";
  dom.clientsBody.innerHTML = "";

  visible.forEach(({ client, result }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-label="Cliente"><strong>${escapeHtml(client.name || "-")}</strong><small>${result.unitPriceWarning ? "Verificar precio unitario" : result.reasonability <= 0 ? "Revisar razonabilidad" : "OK razonabilidad"}</small></td>
      <td data-label="CUIT">${escapeHtml(client.cuit || "-")}</td>
      <td data-label="Tipo">${client.type === "S" ? "Servicios" : "Ventas"}</td>
      <td data-label="Cat. actual"><span class="badge">${client.currentCategory || "-"}</span></td>
      <td data-label="Total sem.">${money.format(result.semester)}</td>
      <td data-label="Anualizado">${money.format(result.annualized)}</td>
      <td data-label="Cat. final"><span class="badge ${result.passesRi ? "danger" : ""}">${result.finalCategory}</span></td>
      <td data-label="Cuota est.">${result.estimatedFee ? money.format(result.estimatedFee) : "-"}</td>
      <td data-label="Diferencia">${typeof result.deltaFee === "number" ? money.format(result.deltaFee) : "-"}</td>
      <td data-label="Conclusion"><span class="badge ${statusClass(result.status)}">${escapeHtml(result.conclusion)}</span></td>
      <td data-label="Acciones">
        <div class="row-actions">
          <button class="icon-button" title="Editar" aria-label="Editar" data-action="edit" data-id="${client.id}">&#9998;</button>
          <button class="icon-button" title="Eliminar" aria-label="Eliminar" data-action="delete" data-id="${client.id}">&times;</button>
        </div>
      </td>
    `;
    dom.clientsBody.appendChild(tr);
  });
}

function renderCategories() {
  dom.categoryGrid.innerHTML = categories
    .map(
      (item) => `
        <article class="category-card">
          <strong>${item.cat}</strong>
          <dl>
            <dt>Ingresos: ${money.format(item.income)}</dt>
            <dt>Superficie: ${number.format(item.surface)} m2</dt>
            <dt>Energia: ${number.format(item.energy)} Kw</dt>
            <dt>Cuota S/V: ${money.format(item.serviceFee)} / ${money.format(item.salesFee)}</dt>
          </dl>
        </article>
      `
    )
    .join("");
}

function fillCategorySelect() {
  dom.currentCategoryInput.innerHTML = categories.map((item) => `<option value="${item.cat}">${item.cat}</option>`).join("");
}

function openDialog(client = null) {
  dom.dialogTitle.textContent = client ? "Editar cliente" : "Nuevo cliente";
  dom.form.reset();
  fields.id.value = client?.id || "";
  fields.name.value = client?.name || "";
  fields.cuit.value = client?.cuit || "";
  fields.type.value = client?.type || "S";
  fields.currentCategory.value = client?.currentCategory || "A";
  ["jan", "feb", "mar", "apr", "may", "jun", "surface", "energy", "unitPrice", "rent", "purchases", "expenses", "currentFee"].forEach((key) => {
    fields[key].value = client?.[key] ?? "";
  });
  dom.dialog.showModal();
}

function readForm() {
  return {
    id: fields.id.value || makeId(),
    name: fields.name.value.trim(),
    cuit: fields.cuit.value.trim(),
    type: fields.type.value,
    currentCategory: fields.currentCategory.value,
    jan: toAmount(fields.jan.value),
    feb: toAmount(fields.feb.value),
    mar: toAmount(fields.mar.value),
    apr: toAmount(fields.apr.value),
    may: toAmount(fields.may.value),
    jun: toAmount(fields.jun.value),
    surface: toAmount(fields.surface.value),
    energy: toAmount(fields.energy.value),
    unitPrice: toAmount(fields.unitPrice.value),
    rent: toAmount(fields.rent.value),
    purchases: toAmount(fields.purchases.value),
    expenses: toAmount(fields.expenses.value),
    currentFee: toAmount(fields.currentFee.value)
  };
}

function saveClient(event) {
  event.preventDefault();
  const client = readForm();
  const index = clients.findIndex((item) => item.id === client.id);
  if (index >= 0) clients[index] = client;
  else clients.push(client);
  writeStorage();
  dom.dialog.close();
  renderClients();
}

function deleteClient(id) {
  clients = clients.filter((client) => client.id !== id);
  writeStorage();
  renderClients();
}

function loadSample() {
  clients = [
    {
      id: makeId(),
      name: "Cliente Servicios Norte",
      cuit: "20-12345678-9",
      type: "S",
      currentCategory: "C",
      jan: 1350000,
      feb: 1420000,
      mar: 1580000,
      apr: 1650000,
      may: 1700000,
      jun: 0,
      surface: 45,
      energy: 4200,
      unitPrice: 0,
      rent: 2100000,
      purchases: 1100000,
      expenses: 1400000,
      currentFee: 55227.06
    },
    {
      id: makeId(),
      name: "Comercio Integral Sur",
      cuit: "27-87654321-3",
      type: "V",
      currentCategory: "F",
      jan: 6200000,
      feb: 6400000,
      mar: 6900000,
      apr: 7100000,
      may: 7350000,
      jun: 7450000,
      surface: 180,
      energy: 18500,
      unitPrice: 1800000,
      rent: 6800000,
      purchases: 17000000,
      expenses: 4800000,
      currentFee: 111198.27
    }
  ];
  writeStorage();
  renderClients();
}

function exportCsv() {
  const header = ["razon_social", "cuit", "tipo", "categoria_actual", "enero", "febrero", "marzo", "abril", "mayo", "junio_real", "superficie", "energia", "precio_unitario", "alquiler", "compras", "gastos", "cuota_actual", "categoria_final", "conclusion"];
  const rows = clients.map((client) => {
    const result = calculateClient(client);
    return [
      client.name,
      client.cuit,
      client.type,
      client.currentCategory,
      client.jan,
      client.feb,
      client.mar,
      client.apr,
      client.may,
      client.jun,
      client.surface,
      client.energy,
      client.unitPrice,
      client.rent,
      client.purchases,
      client.expenses,
      client.currentFee,
      result.finalCategory,
      result.conclusion
    ];
  });
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "control-recategorizacion-monotributo-2026.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function importCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsv(String(reader.result || ""));
    const [, ...dataRows] = rows;
    const imported = dataRows
      .filter((row) => row.some(Boolean))
      .map((row) => ({
        id: makeId(),
        name: row[0] || "",
        cuit: row[1] || "",
        type: row[2] === "V" ? "V" : "S",
        currentCategory: categoryOrder.includes(row[3]) ? row[3] : "A",
        jan: toAmount(row[4]),
        feb: toAmount(row[5]),
        mar: toAmount(row[6]),
        apr: toAmount(row[7]),
        may: toAmount(row[8]),
        jun: toAmount(row[9]),
        surface: toAmount(row[10]),
        energy: toAmount(row[11]),
        unitPrice: toAmount(row[12]),
        rent: toAmount(row[13]),
        purchases: toAmount(row[14]),
        expenses: toAmount(row[15]),
        currentFee: toAmount(row[16])
      }));
    clients = [...clients, ...imported];
    writeStorage();
    renderClients();
    dom.csvFileInput.value = "";
  };
  reader.readAsText(file, "utf-8");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsv(text) {
  const delimiter = text.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function bindEvents() {
  dom.addClientButton.addEventListener("click", () => openDialog());
  dom.addClientButtonInline.addEventListener("click", () => openDialog());
  dom.closeDialogButton.addEventListener("click", () => dom.dialog.close());
  dom.cancelDialogButton.addEventListener("click", () => dom.dialog.close());
  dom.form.addEventListener("submit", saveClient);
  dom.searchInput.addEventListener("input", renderClients);
  dom.statusFilter.addEventListener("change", renderClients);
  dom.ipcInput.addEventListener("input", () => {
    settings.ipc = toAmount(dom.ipcInput.value);
    writeStorage();
    renderClients();
  });
  dom.clientsBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const client = clients.find((item) => item.id === button.dataset.id);
    if (button.dataset.action === "edit" && client) openDialog(client);
    if (button.dataset.action === "delete" && client) deleteClient(client.id);
  });
  dom.sampleButton.addEventListener("click", loadSample);
  dom.clearButton.addEventListener("click", () => {
    clients = [];
    writeStorage();
    renderClients();
  });
  dom.exportButton.addEventListener("click", exportCsv);
  dom.importButton.addEventListener("click", () => dom.csvFileInput.click());
  dom.csvFileInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) importCsv(file);
  });
}

function init() {
  fillCategorySelect();
  readStorage();
  dom.ipcInput.value = settings.ipc;
  renderCategories();
  renderClients();
  bindEvents();
}

init();
