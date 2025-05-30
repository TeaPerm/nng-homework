const serviceMethods = {
  userService: ["getUserProfile"],
  imageService: ["getImageByName"],
  mathService: ["getFibonacci", "multiplyMatrices"],
};

const select = document.getElementById("apiServiceSelect");
const methodsContainer = document.getElementById("methodsContainer");
const runApiBtn = document.getElementById("runApiBtn");
const apiInput = document.getElementById("apiInput");
const api = "http://localhost:3000/api";

 window.addEventListener('DOMContentLoaded', async () => {
    const apiServiceSelect = document.getElementById('apiServiceSelect');
    const methodSelect = document.getElementById('method-select');
    const parametersContainer = document.getElementById('parameters-container');
    const apiInput = document.getElementById('apiInput');

    let serviceData = {};

    try {
      const response = await fetch(api);
      const data = await response.json();

      if (data.status === 200 && data.services) {
        serviceData = data.services;

        for (const serviceName in serviceData) {
          const option = document.createElement('option');
          option.value = serviceName;
          option.textContent = formatLabel(serviceName);
          apiServiceSelect.appendChild(option);
        }

        apiServiceSelect.addEventListener('change', () => {
          updateMethods();
          updateTextarea();
        });

        methodSelect.addEventListener('change', () => {
          updateParams();
          updateTextarea();
        });
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }

    function updateMethods() {
      const selectedService = apiServiceSelect.value;
      const methods = serviceData[selectedService] || {};

      methodSelect.innerHTML = '<option value="">Select a method...</option>';
      parametersContainer.innerHTML = '';

      for (const methodName in methods) {
        const option = document.createElement('option');
        option.value = methodName;
        option.textContent = methodName;
        methodSelect.appendChild(option);
      }
    }

    function updateParams() {
      const selectedService = apiServiceSelect.value;
      const selectedMethod = methodSelect.value;
      const methodDetails = serviceData[selectedService]?.[selectedMethod];

      parametersContainer.innerHTML = '';

      if (methodDetails && methodDetails.params) {
        methodDetails.params.forEach(param => {
          const formGroup = document.createElement('div');
          formGroup.className = 'form-group';

          const label = document.createElement('label');
          label.className = 'label';
          label.textContent = `${param.name} (${param.type})`;

          const input = document.createElement('input');
          input.className = 'input';
          input.name = param.name;
          input.setAttribute('data-type', param.type);
          input.placeholder = `Enter ${param.name}`;

          input.addEventListener('input', updateTextarea);

          formGroup.appendChild(label);
          formGroup.appendChild(input);
          parametersContainer.appendChild(formGroup);
        });
      }
    }

    function updateTextarea() {
      const service = apiServiceSelect.value;
      const method = methodSelect.value;
      const paramInputs = parametersContainer.querySelectorAll('input');

      const params = [];
      paramInputs.forEach(input => {
        const type = input.getAttribute('data-type');
        const rawValue = input.value;

        try {
          if (type.includes('[]')) {
            params.push(JSON.parse(rawValue));
          } else if (type === 'number') {
            params.push(Number(rawValue));
          } else {
            params.push(rawValue);
          }
        } catch {
          params.push(rawValue);
        }
      });

      const apiCall = {
        service,
        method,
        params
      };

      apiInput.value = JSON.stringify([apiCall], null, 2);
    }

    function formatLabel(str) {
      return str.replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/^./, char => char.toUpperCase());
    }
  });

select.addEventListener("change", () => {
  methodsContainer.innerHTML = "";
  const selectedService = select.value;

  if (selectedService && serviceMethods[selectedService]) {
    serviceMethods[selectedService].forEach((method) => {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = method;
      methodsContainer.appendChild(badge);
    });
  }
});

runApiBtn.addEventListener("click", async () => {
  let jsonData;

  try {
    jsonData = JSON.parse(apiInput.value);
    console.log(jsonData);
  } catch (e) {
    alert("Invalid JSON format.");
    return;
  }

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert("Request sent successfully.");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to send request.");
    });
});
