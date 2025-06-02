const select = document.getElementById("apiServiceSelect");
const methodsContainer = document.getElementById("methodsContainer");
const runApiBtn = document.getElementById("runApiBtn");
const apiInput = document.getElementById("apiInput");
const loadingSpinner = document.getElementById("loadingSpinner");
const docsGrid = document.querySelector(".docs-grid");
let isDarkTheme = false;
let isLeftAligned = true;
const api = "http://localhost:3000/api";

window.addEventListener("DOMContentLoaded", async () => {
  const apiServiceSelect = document.getElementById("apiServiceSelect");
  loadTheme();
  const methodSelect = document.getElementById("method-select");
  const parametersContainer = document.getElementById("parameters-container");
  const apiInput = document.getElementById("apiInput");

  let serviceData = {};

  try {
    const response = await fetch(api);
    const data = await response.json();

    if (data.status === 200 && data.services) {
      serviceData = data.services;

      for (const serviceName in serviceData) {
        const option = document.createElement("option");
        option.value = serviceName;
        option.textContent = formatLabel(serviceName);
        apiServiceSelect.appendChild(option);
      }

      updateDocsGrid();

      apiServiceSelect.addEventListener("change", () => {
        updateMethods();
        updateParams();
        updateTextarea();
        updateBadges();
      });

      methodSelect.addEventListener("change", () => {
        updateParams();
        updateTextarea();
      });
    }
  } catch (err) {
    console.error("Failed to load services:", err);
  }

  function updateMethods() {
    const selectedService = apiServiceSelect.value;
    const methods = serviceData[selectedService] || {};

    methodSelect.innerHTML = '<option value="">Select a method...</option>';
    parametersContainer.innerHTML = "";

    for (const methodName in methods) {
      const option = document.createElement("option");
      option.value = methodName;
      option.textContent = methodName;
      methodSelect.appendChild(option);
    }
  }

  function updateParams() {
    const selectedService = apiServiceSelect.value;
    const selectedMethod = methodSelect.value;
    const methodDetails = serviceData[selectedService]?.[selectedMethod];

    parametersContainer.innerHTML = "";

    if (methodDetails && methodDetails.params) {
      methodDetails.params.forEach((param) => {
        const formGroup = document.createElement("div");
        formGroup.className = "form-group";

        const label = document.createElement("label");
        label.className = "label";
        label.textContent = `${param.name} (${param.type})`;

        const input = document.createElement("input");
        input.className = "input";
        input.name = param.name;
        input.setAttribute("data-type", param.type);
        input.placeholder = `Enter ${param.name}`;

        input.addEventListener("input", updateTextarea);

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        parametersContainer.appendChild(formGroup);
      });
    }
  }

  function updateTextarea() {
    const service = apiServiceSelect.value;
    const method = methodSelect.value;
    const paramInputs = parametersContainer.querySelectorAll("input");

    const params = {};
    paramInputs.forEach((input) => {
      const name = input.name;
      const type = input.getAttribute("data-type");
      const rawValue = input.value;

      try {
        if (type.includes("[]")) {
          params[name] = JSON.parse(rawValue);
        } else if (type === "number") {
          params[name] = Number(rawValue);
        } else {
          params[name] = rawValue;
        }
      } catch {
        params[name] = rawValue;
      }
    });

    const apiCall = {
      service,
      method,
      params,
    };

    apiInput.value = JSON.stringify([apiCall], null, 2);
  }

  function updateBadges() {
    const selectedService = apiServiceSelect.value;
    methodsContainer.innerHTML = "";

    if (selectedService && serviceData[selectedService]) {
      for (const method in serviceData[selectedService]) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = method;
        methodsContainer.appendChild(badge);
      }
    }
  }

  function updateDocsGrid() {
    docsGrid.innerHTML = "";

    for (const serviceName in serviceData) {
      const methods = serviceData[serviceName];

      const docItem = document.createElement("div");
      docItem.className = "doc-item";

      const docTitle = document.createElement("h3");
      docTitle.className = "doc-title";
      docTitle.textContent = formatLabel(serviceName);
      docItem.appendChild(docTitle);

      const ul = document.createElement("ul");
      ul.className = "doc-methods";

      for (const methodName in methods) {
        const li = document.createElement("li");

        const statusDot = document.createElement("span");
        statusDot.className = "status-dot";

        const params = methods[methodName].params || [];
        const paramNames = params.map((p) => p.name).join(", ");

        li.appendChild(statusDot);
        li.appendChild(
          document.createTextNode(`${methodName} (${paramNames})`)
        );
        ul.appendChild(li);
      }

      docItem.appendChild(ul);
      docsGrid.appendChild(docItem);
    }
  }

  function formatLabel(str) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (char) => char.toUpperCase());
  }
});

runApiBtn.addEventListener("click", async () => {
  let jsonData;

  loadingSpinner.style.display = "inline-block";

  try {
    const parsed = JSON.parse(apiInput.value);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const first = parsed[0];
      jsonData = {
        service: first.service,
        method: first.method,
        params: Object.values(first.params),
      };
    } else {
      throw new Error("Input must be a non-empty array.");
    }

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const resultsDisplay = document.querySelector(".results-display code");
    const formattedJson = JSON.stringify(data, null, 2);
    resultsDisplay.textContent = formattedJson;
    Prism.highlightElement(resultsDisplay);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loadingSpinner.style.display = "none";
  }
});

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  const body = document.body;
  const themeText = document.getElementById("theme-text");
  const themeIcon = document.getElementById("theme-icon");

  if (isDarkTheme) {
    body.classList.add("dark-theme");
    themeText.textContent = "Light Theme";
    themeIcon.textContent = "☀️";
  } else {
    body.classList.remove("dark-theme");
    themeText.textContent = "Dark Theme";
    themeIcon.textContent = "🌙";
  }

  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkTheme = true;
    document.body.classList.add("dark-theme");
    document.getElementById("theme-text").textContent = "Light Theme";
    document.getElementById("theme-icon").textContent = "☀️";
  }
}

function toggleAlignment() {
  isLeftAligned = !isLeftAligned;
  const alignText = document.getElementById("align-text");
  const controls = document.querySelectorAll(".controls");
  const buttonWrapper = document.getElementById("buttonWrapper");

  controls.forEach((control) => {
    if (isLeftAligned) {
      control.style.order = "-1";
      alignText.textContent = "Align to Right";
      buttonWrapper.style.justifyContent = "flex-start";
    } else {
      control.style.order = "1";
      alignText.textContent = "Align to Left";
      buttonWrapper.style.justifyContent = "flex-end";
    }
  });
}
