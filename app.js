const $ = (sel) => document.querySelector(sel);

const API_BASE_URL = (window.RELATORIOS_CONFIG?.API_BASE_URL || '').replace(/\/$/, '');
function apiUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
}

const form = $('#reportForm');
const validateBtn = $('#validateBtn');
const toast = $('#toast');
const historyRows = $('#historyRows');
let activeJob = null;
let timerStart = null;
let timerInterval = null;

const demoOperators = [
  'Todos os operadores',
  'Ismaias Mathyas',
  'Jailson Maceno',
  'Midian Silva',
  'Vinicius Araújo',
  'Kayki Lima',
  'Amanda Franciele',
  'Rennan Victor'
];
const demoFilas = ['Todas as filas', 'rcpt0800', 'Atendimento', 'Cobrança', 'Equipe 1', 'Equipe 2'];


const monthNames = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const datePickerState = {
  view: new Date(),
  start: null,
  end: null
};

datePickerState.view = new Date(datePickerState.view.getFullYear(), datePickerState.view.getMonth(), 1);

function cloneDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatBrDate(date) {
  if (!date) return '';
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
  if (!date || !start || !end) return false;
  const d = cloneDate(date).getTime();
  return d > cloneDate(start).getTime() && d < cloneDate(end).getTime();
}

function updateDateRangeInput(previewOnly = false) {
  const input = $('#periodoRelatorio');
  const dataInicial = $('#dataInicial');
  const dataFinal = $('#dataFinal');
  const hint = $('#calendarHint');
  const { start, end } = datePickerState;

  if (!start && !end) {
    input.value = '';
    if (!previewOnly) {
      dataInicial.value = '';
      dataFinal.value = '';
    }
    hint.textContent = 'Clique na data inicial e depois na data final.';
    return;
  }

  if (start && !end) {
    input.value = `${formatBrDate(start)} até ...`;
    hint.textContent = 'Agora selecione a data final.';
    if (!previewOnly) {
      dataInicial.value = '';
      dataFinal.value = '';
    }
    return;
  }

  input.value = `${formatBrDate(start)} até ${formatBrDate(end)}`;
  hint.textContent = 'Período selecionado. Clique em Aplicar período.';
  if (!previewOnly) {
    dataInicial.value = formatBrDate(start);
    dataFinal.value = formatBrDate(end);
  }
}

function renderCalendar() {
  const grid = $('#calendarGrid');
  const label = $('#calendarMonthLabel');
  if (!grid || !label) return;

  const view = datePickerState.view;
  const year = view.getFullYear();
  const month = view.getMonth();
  const today = cloneDate(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  label.textContent = `${monthNames[month]} de ${year}`;
  grid.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('span');
    blank.className = 'calendar-blank';
    grid.appendChild(blank);
  }

  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(year, month, day);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar-day';
    btn.textContent = String(day);

    if (sameDay(date, today)) btn.classList.add('today');
    if (sameDay(date, datePickerState.start) || sameDay(date, datePickerState.end)) btn.classList.add('selected');
    if (isBetween(date, datePickerState.start, datePickerState.end)) btn.classList.add('range');

    btn.addEventListener('click', () => selectCalendarDay(date));
    grid.appendChild(btn);
  }
}

function selectCalendarDay(date) {
  const selected = cloneDate(date);
  const { start, end } = datePickerState;

  if (!start || (start && end)) {
    datePickerState.start = selected;
    datePickerState.end = null;
  } else if (selected.getTime() < start.getTime()) {
    datePickerState.end = start;
    datePickerState.start = selected;
  } else {
    datePickerState.end = selected;
  }

  updateDateRangeInput(true);
  renderCalendar();
}

function openCalendar() {
  const popover = $('#calendarPopover');
  if (!popover) return;
  popover.classList.add('open');
  popover.setAttribute('aria-hidden', 'false');
  renderCalendar();
}

function closeCalendar() {
  const popover = $('#calendarPopover');
  if (!popover) return;
  popover.classList.remove('open');
  popover.setAttribute('aria-hidden', 'true');
}

function setupDateRangePicker() {
  const input = $('#periodoRelatorio');
  const openBtn = $('#openCalendarBtn');
  const popover = $('#calendarPopover');
  if (!input || !openBtn || !popover) return;

  input.addEventListener('click', openCalendar);
  openBtn.addEventListener('click', openCalendar);

  $('#prevMonth')?.addEventListener('click', () => {
    datePickerState.view = new Date(datePickerState.view.getFullYear(), datePickerState.view.getMonth() - 1, 1);
    renderCalendar();
  });

  $('#nextMonth')?.addEventListener('click', () => {
    datePickerState.view = new Date(datePickerState.view.getFullYear(), datePickerState.view.getMonth() + 1, 1);
    renderCalendar();
  });

  $('#clearDates')?.addEventListener('click', () => {
    datePickerState.start = null;
    datePickerState.end = null;
    updateDateRangeInput(false);
    renderCalendar();
  });

  $('#applyDates')?.addEventListener('click', () => {
    if (!datePickerState.start || !datePickerState.end) {
      notify('Selecione a data inicial e a data final.');
      return;
    }
    updateDateRangeInput(false);
    closeCalendar();
  });

  document.addEventListener('click', (event) => {
    const wrap = $('#dateRangeWrap');
    if (wrap && !wrap.contains(event.target)) closeCalendar();
  });

  renderCalendar();
}

function setupSelects() {
  const op = $('#operadorSelect');
  const fila = $('#filaSelect');
  op.innerHTML = demoOperators.map(v => `<option>${v}</option>`).join('');
  fila.innerHTML = demoFilas.map(v => `<option>${v}</option>`).join('');
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function formData() {
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}

function setProgress(value) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  $('#progressRing').style.setProperty('--p', v);
  $('#progressText').textContent = `${v}%`;
  const line = $('#linearProgress');
  if (line) line.style.width = `${v}%`;
}

function formatSeconds(totalSeconds) {
  const secs = Math.max(0, Math.round(Number(totalSeconds || 0)));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function pageStatsFromStep(step = '') {
  const match = String(step).match(/p[áa]gina\s+(\d+)(?:\s+de\s+(\d+))?/i);
  return {
    current: match ? Number(match[1]) : 0,
    total: match?.[2] ? Number(match[2]) : 0
  };
}

function calculateEta(job) {
  if (job.tempoEstimadoRestante) return job.tempoEstimadoRestante;
  if (!timerStart || !job.progress || job.progress <= 3 || job.progress >= 100) return '--';
  const elapsedSeconds = (Date.now() - timerStart) / 1000;
  const remainingSeconds = elapsedSeconds * ((100 - Number(job.progress)) / Number(job.progress));
  return formatSeconds(Math.min(remainingSeconds, 99 * 60));
}

function updateExecutionCounter(job) {
  const parsed = pageStatsFromStep(job.step);
  const currentPage = Number(job.paginaAtual || parsed.current || 0);
  const totalPages = Number(job.totalPaginas || parsed.total || 0);
  const counter = $('#pageCounter');
  const line = $('#executionLine');
  const eta = $('#etaPill');
  const rows = Number(job.registrosLidos || estimateRows(job.progress));
  const speed = job.velocidadeMedia || (currentPage && timerStart
    ? `${Math.max(1, Math.round(currentPage / Math.max((Date.now() - timerStart) / 60000, 0.1)))} páginas/min`
    : '—');

  if (counter) counter.textContent = totalPages ? `${currentPage || 0} de ${totalPages}` : (currentPage ? `${currentPage} de ?` : '0 de 0');
  if (line) line.textContent = job.step || 'Aguardando início da automação.';
  if (eta) eta.textContent = `⏱ Tempo estimado restante: ${job.status === 'done' ? '00m 00s' : calculateEta(job)}`;
  $('#metricRows').textContent = rows.toLocaleString('pt-BR');
  $('#metricSpeed').textContent = speed;
  if (job.linhasPorPagina) $('#metricPageRows').textContent = Number(job.linhasPorPagina).toLocaleString('pt-BR');

  const items = Array.from($('#stepsList').children);
  if (items[4]) items[4].textContent = totalPages && currentPage ? `Coletando página ${currentPage} de ${totalPages}` : 'Coletando páginas';
}

function updateSteps(step, status) {
  const items = Array.from($('#stepsList').children);
  const text = String(step || '').toLowerCase();
  let currentIndex = 0;

  if (text.includes('login')) currentIndex = 0;
  else if (text.includes('pausa')) currentIndex = 1;
  else if (text.includes('relatório') || text.includes('relatorio')) currentIndex = 2;
  else if (text.includes('filtro')) currentIndex = 3;
  else if (text.includes('página') || text.includes('pagina') || text.includes('colet')) currentIndex = 4;
  else if (text.includes('consolid')) currentIndex = 5;
  else if (status === 'done') currentIndex = 5;

  items.forEach((li, i) => {
    li.classList.remove('done', 'current', 'pending');
    if (status === 'done' || i < currentIndex) li.classList.add('done');
    else if (i === currentIndex) li.classList.add('current');
    else li.classList.add('pending');
  });
}

function setBadge(status) {
  const badge = $('#jobBadge');
  badge.className = 'badge';
  const map = {
    queued: 'Na fila',
    running: 'Em andamento',
    done: 'Concluído',
    error: 'Falha'
  };
  badge.textContent = map[status] || 'Aguardando';
  if (status === 'running') badge.classList.add('running');
  if (status === 'done') badge.classList.add('done');
  if (status === 'error') badge.classList.add('error');
}

function startTimer() {
  timerStart = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerStart) return;
    const secs = Math.floor((Date.now() - timerStart) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    $('#metricTime').textContent = `${String(m).padStart(2, '0')}m${String(s).padStart(2, '0')}s`;
  }, 500);
}

function stopTimer() {
  clearInterval(timerInterval);
}

async function pollJob(jobId) {
  activeJob = jobId;
  startTimer();

  while (activeJob === jobId) {
    const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
    const data = await res.json();
    if (!data.ok) {
      notify(data.error || 'Erro ao consultar execução.');
      break;
    }

    const job = data.job;
    setBadge(job.status);
    setProgress(job.progress);
    updateSteps(job.step, job.status);
    updateExecutionCounter(job);

    if (job.status === 'done') {
      stopTimer();
      renderResult(job.result);
      notify('Relatório gerado com sucesso.');
      await loadHistory();
      break;
    }

    if (job.status === 'error') {
      stopTimer();
      notify(job.error || 'Falha na execução do relatório.');
      await loadHistory();
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
  }
}

function estimateRows(progress) {
  const max = 61358;
  const p = Math.max(0, Math.min(95, Number(progress || 0)));
  return Math.round((p / 95) * max);
}

function renderResult(result) {
  if (!result) return;
  $('#totalRows').textContent = Number(result.totalRegistros || 0).toLocaleString('pt-BR');
  $('#totalPages').textContent = result.paginasCapturadas || '—';
  $('#totalTime').textContent = result.tempoTotal || '—';
  $('#finalFile').textContent = result.csvFile || 'relatório.csv';

  const csv = $('#downloadCsv');
  const xlsx = $('#downloadXlsx');
  csv.classList.remove('disabled');
  xlsx.classList.remove('disabled');
  csv.href = apiUrl(`/api/download/${encodeURIComponent(result.csvFile)}`);
  xlsx.href = apiUrl(`/api/download/${encodeURIComponent(result.xlsxFile)}`);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = formData();
  if (!payload.dataInicial || !payload.dataFinal) {
    notify('Selecione o período do relatório no calendário.');
    openCalendar();
    return;
  }
  setProgress(0);
  setBadge('queued');
  $('#downloadCsv').classList.add('disabled');
  $('#downloadXlsx').classList.add('disabled');
  $('#totalRows').textContent = '—';
  $('#totalPages').textContent = '—';
  $('#totalTime').textContent = '—';
  $('#finalFile').textContent = 'Gerando...';
  $('#pageCounter').textContent = '0 de 0';
  $('#executionLine').textContent = 'Iniciando automação...';
  $('#etaPill').textContent = '⏱ Tempo estimado restante: calculando...';
  $('#metricSpeed').textContent = '—';

  try {
    const res = await fetch(apiUrl('/api/relatorios/gerar'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Erro ao iniciar relatório.');
    notify('Automação iniciada.');
    pollJob(data.jobId);
  } catch (err) {
    notify(err.message);
  }
});

validateBtn.addEventListener('click', async () => {
  const payload = formData();
  if (!payload.dataInicial || !payload.dataFinal) {
    notify('Selecione o período do relatório no calendário.');
    openCalendar();
    return;
  }
  try {
    validateBtn.disabled = true;
    validateBtn.textContent = 'Validando...';
    const res = await fetch(apiUrl('/api/validar-acesso'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Falha ao validar.');
    notify(data.result?.message || 'Acesso validado com sucesso.');
  } catch (err) {
    notify(err.message);
  } finally {
    validateBtn.disabled = false;
    validateBtn.textContent = '🛡 Validar acesso e pausa';
  }
});

$('#rerunBtn').addEventListener('click', () => form.requestSubmit());
$('#btnScrollHistory')?.addEventListener('click', () => $('#historyCard').scrollIntoView({ behavior: 'smooth' }));
$('#btnScrollSettings')?.addEventListener('click', () => $('#settingsCard').scrollIntoView({ behavior: 'smooth' }));

async function loadHistory() {
  try {
    const res = await fetch(apiUrl('/api/historico'));
    const data = await res.json();
    const items = data.items || [];
    if (!items.length) {
      historyRows.innerHTML = seedHistory();
      return;
    }
    historyRows.innerHTML = items.slice(0, 3).map(row => {
      const dt = new Date(row.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      const arquivo = row.arquivoCsv ? `<a class="download-mini" href="${apiUrl(`/api/download/${encodeURIComponent(row.arquivoCsv)}`)}">⬇</a>` : '';
      return `<tr>
        <td>${dt}</td>
        <td>${row.tipoRelatorio || '-'}</td>
        <td>${Number(row.registros || 0).toLocaleString('pt-BR')}</td>
        <td><span class="status-pill">${row.status}</span></td>
        <td>${row.tempoTotal || '-'}</td>
        <td>${arquivo}</td>
      </tr>`;
    }).join('');
  } catch {
    historyRows.innerHTML = seedHistory();
  }
}

function seedHistory() {
  return `
    <tr><td>23/06/2026 08:45</td><td>Entrante</td><td>61.358</td><td><span class="status-pill">Sucesso</span></td><td>03m41s</td><td>⬇</td></tr>
    <tr><td>22/06/2026 22:15</td><td>Entrante</td><td>58.923</td><td><span class="status-pill">Sucesso</span></td><td>03m28s</td><td>⬇</td></tr>
    <tr><td>22/06/2026 08:30</td><td>Entrante</td><td>59.112</td><td><span class="status-pill">Sucesso</span></td><td>03m35s</td><td>⬇</td></tr>
  `;
}

async function init() {
  setupSelects();
  setupDateRangePicker();
  await loadHistory();
  try {
    const res = await fetch(apiUrl('/api/status'));
    const data = await res.json();
    if (data.demoMode) notify('Projeto em modo demonstração. Para usar no sistema real, altere DEMO_MODE=false.');
  } catch {}
}

init();
