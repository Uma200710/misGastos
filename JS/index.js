let gastos = [];
let popup = document.getElementById('popup');
let nombreInput = document.getElementById('nombre');
let montoInput = document.getElementById('monto');
let montoDisplay = document.getElementById('montoDisplay');
let totalAmountDisplay = document.getElementById('totalAmount');
let currentButton = null;
let currentGastoIndex = null;

document.getElementById('addExpenseButton').addEventListener('click', () => {
    nombreInput.value = '';
    montoInput.value = '';
    montoDisplay.textContent = '';
    popup.style.display = 'block';
    currentButton = null; 
    currentGastoIndex = null; 
});

montoInput.addEventListener('input', () => {
    let monto = parseFloat(montoInput.value);
    montoDisplay.textContent = isNaN(monto) ? '' : `Monto: $${monto.toFixed(2)}`;
});

document.getElementById('saveButton').addEventListener('click', () => {
    let nombre = nombreInput.value;
    let monto = parseFloat(montoInput.value);

    if (nombre && !isNaN(monto)) {
        if (currentGastoIndex !== null) {
            gastos[currentGastoIndex].Monto = monto;
            let button = document.querySelector(`#buttonsContainer button[data-index="${currentGastoIndex}"]`);
            if (button) {
                button.innerText = `${nombre} ($${monto.toFixed(2)})`;
            }
        } else {
            let index = gastos.length;
            gastos.push({ Nombre: nombre, Monto: monto });
            let button = document.createElement('button');
            button.innerText = `${nombre} ($${monto.toFixed(2)})`;
            button.dataset.index = index; // Usar un índice para identificar el gasto
            button.addEventListener('click', () => {
                nombreInput.value = gastos[button.dataset.index].Nombre;
                montoInput.value = gastos[button.dataset.index].Monto;
                montoDisplay.textContent = `Monto: $${gastos[button.dataset.index].Monto.toFixed(2)}`;
                popup.style.display = 'block';
                currentButton = button;
                currentGastoIndex = button.dataset.index;
            });
            document.getElementById('buttonsContainer').appendChild(button);
        }

        saveGastos();
        popup.style.display = 'none';
        nombreInput.value = '';
        montoInput.value = '';
        updateTotalAmount();
    } else {
        alert('Por favor, ingresa un nombre y un monto válido.');
    }
});

function updateTotalAmount() {
    let total = gastos.reduce((sum, g) => sum + g.Monto, 0);
    totalAmountDisplay.textContent = `Total: $${total.toFixed(2)}`;
}


function saveGastos() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

function loadGastos() {
    const savedGastos = localStorage.getItem('gastos');
    if (savedGastos) {
        gastos = JSON.parse(savedGastos);
        gastos.forEach((gasto, index) => {
            let button = document.createElement('button');
            button.innerText = `${gasto.Nombre} ($${gasto.Monto.toFixed(2)})`;
            button.dataset.index = index;
            button.addEventListener('click', () => {
                nombreInput.value = gasto.Nombre;
                montoInput.value = gasto.Monto;
                montoDisplay.textContent = `Monto: $${gasto.Monto.toFixed(2)}`;
                popup.style.display = 'block';
                currentButton = button;
                currentGastoIndex = index;
            });
            document.getElementById('buttonsContainer').appendChild(button);
        });
        updateTotalAmount();
    }
}

window.onload = loadGastos;
