const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const fileMeta = document.getElementById("fileMeta");
const analyzeButton = document.getElementById("analyzeButton");
const clearButton = document.getElementById("clearButton");
const analysisContent = document.getElementById("analysisContent");

let currentFile = null;

const bytesToSize = (bytes) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const resetPreview = () => {
  preview.innerHTML = '<p class="preview__placeholder">Your preview will appear here.</p>';
  fileMeta.innerHTML = "";
  analysisContent.innerHTML = `
    <div class="analysis__empty">
      <p>No analysis yet. Upload a file to get started.</p>
    </div>
  `;
};

const setButtons = (enabled) => {
  analyzeButton.disabled = !enabled;
  clearButton.disabled = !enabled;
};

const handleFile = (file) => {
  currentFile = file;
  setButtons(Boolean(file));

  if (!file) {
    resetPreview();
    return;
  }

  fileMeta.innerHTML = `
    <div><strong>Name:</strong> ${file.name}</div>
    <div><strong>Type:</strong> ${file.type || "Unknown"}</div>
    <div><strong>Size:</strong> ${bytesToSize(file.size)}</div>
  `;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="Uploaded chart preview" />`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = `
      <div class="preview__placeholder">
        <p>CSV file ready. Click analyze to generate stats.</p>
      </div>
    `;
  }
};

const parseCsv = (text) => {
  const rows = text.trim().split(/\r?\n/).map((row) => row.split(","));
  if (!rows.length) return { headers: [], data: [] };
  const headers = rows[0];
  const data = rows.slice(1);
  return { headers, data };
};

const getNumericStats = (headers, data) => {
  const columns = headers.map((header, index) => {
    const values = data
      .map((row) => Number(row[index]))
      .filter((value) => !Number.isNaN(value));
    if (!values.length) return null;
    const sum = values.reduce((acc, value) => acc + value, 0);
    return {
      header,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      count: values.length,
    };
  });

  return columns.filter(Boolean);
};

const buildStatsMarkup = (stats) => {
  if (!stats.length) {
    return `
      <div class="analysis__empty">
        <p>No numeric columns found in the CSV.</p>
      </div>
    `;
  }

  const cards = stats
    .map(
      (stat) => `
        <div class="stat-card">
          <h3>${stat.header}</h3>
          <p>${stat.avg.toFixed(2)}</p>
          <small>Min ${stat.min.toFixed(2)} · Max ${stat.max.toFixed(2)} · n=${stat.count}</small>
        </div>
      `
    )
    .join("");

  return `<div class="stat-grid">${cards}</div>`;
};

const buildPreviewTable = (headers, data) => {
  const previewRows = data.slice(0, 5);
  const headerCells = headers.map((header) => `<th>${header}</th>`).join("");
  const bodyRows = previewRows
    .map((row) => {
      const cells = row.map((cell) => `<td>${cell}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <table class="table">
      <thead>
        <tr>${headerCells}</tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
};

const analyzeFile = () => {
  if (!currentFile) return;

  if (currentFile.type.startsWith("image/")) {
    analysisContent.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <h3>Next step</h3>
          <p>Image ready</p>
          <small>Add your notes or share with your team for deeper analysis.</small>
        </div>
        <div class="stat-card">
          <h3>Suggested caption</h3>
          <p>${currentFile.name}</p>
          <small>Generated ${new Date().toLocaleString()}</small>
        </div>
      </div>
    `;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const { headers, data } = parseCsv(reader.result);
    const stats = getNumericStats(headers, data);

    analysisContent.innerHTML = `
      <div>
        <h3>Key metrics</h3>
        ${buildStatsMarkup(stats)}
      </div>
      <div>
        <h3>Sample rows</h3>
        ${buildPreviewTable(headers, data)}
      </div>
    `;
  };

  reader.readAsText(currentFile);
};

const clearFile = () => {
  currentFile = null;
  fileInput.value = "";
  setButtons(false);
  resetPreview();
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFile(file);
});

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
  const file = event.dataTransfer.files[0];
  if (file) {
    fileInput.files = event.dataTransfer.files;
    handleFile(file);
  }
});

analyzeButton.addEventListener("click", analyzeFile);
clearButton.addEventListener("click", clearFile);

resetPreview();
