const serviceMethods = {
  userService: ["getUserProfile"],
  imageService: ["getImageByName"],
  mathService: ["getFibonacci", "multiplyMatrices"],
};

const select = document.getElementById("apiServiceSelect");
const methodsContainer = document.getElementById("methodsContainer");
const runApiBtn = document.getElementById("runApiBtn");
const apiInput = document.getElementById("apiInput");

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

});
