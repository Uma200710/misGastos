let gastos = [];
let popup = document.getElementById('popup');
let nombreInput = document.getElementById('nombre');
let montoInput = document.getElementById('monto');
let montoDisplay = document.getElementById('montoDisplay');
let totalAmountDisplay = document.getElementById('totalAmount');
let currentGastoIndex = null;
let chart = null;

document.getElementById('addExpenseButton').addEventListener('click', () => {
    nombreInput.value = '';
    montoInput.value = '';
    montoDisplay.textContent = '';
    popup.style.display = 'block';
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
            createGastoButton(index, nombre, monto);
        }

        guardarGastos();
        popup.style.display = 'none';
        nombreInput.value = '';
        montoInput.value = '';
        actualizarMontosTotales();
        actualizarGrafico();
    } else {
        alert('Por favor, ingresa un nombre y un monto válido.');
    }
});

function actualizarMontosTotales() {
    let total = gastos.reduce((sum, g) => sum + g.Monto, 0);
    totalAmountDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function guardarGastos() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

function cargarGastos() {
    const savedGastos = localStorage.getItem('gastos');
    if (savedGastos) {
        gastos = JSON.parse(savedGastos);
        gastos.forEach((gasto, index) => createGastoButton(index, gasto.Nombre, gasto.Monto));
        actualizarMontosTotales();
        actualizarGrafico();
    }
}

function createGastoButton(index, nombre, monto) {
    let button = document.createElement('button');
    button.innerText = `${nombre} ($${monto.toFixed(2)})`;
    button.dataset.index = index;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => eliminarGasto(index));

    button.addEventListener('click', () => {
        nombreInput.value = gastos[index].Nombre;
        montoInput.value = gastos[index].Monto;
        montoDisplay.textContent = `Monto: $${gastos[index].Monto.toFixed(2)}`;
        popup.style.display = 'block';
        currentGastoIndex = index;
    });

    let container = document.createElement('div');
    container.appendChild(button);
    container.appendChild(deleteButton);
    document.getElementById('buttonsContainer').appendChild(container);
}

function eliminarGasto(index) {
    gastos.splice(index, 1);
    guardarGastos();
    document.getElementById('buttonsContainer').innerHTML = '';
    cargarGastos();
    actualizarGrafico();
}

function actualizarGrafico() {
    if (chart) {
        chart.destroy();
    }

    let ctx = document.getElementById('gastosChart').getContext('2d');
    let labels = gastos.map(g => g.Nombre);
    let data = gastos.map(g => g.Monto);

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

function cargarDatosDesdeJSON() {
    fetch('data/gastos.json')
        .then(response => response.json())
        .then(data => {
            gastos = data;
            guardarGastos();
            document.getElementById('buttonsContainer').innerHTML = '';
            cargarGastos();
        })
        .catch(error => console.error('Error al cargar datos:', error));
}

window.onload = () => {
    cargarGastos();
    cargarDatosDesdeJSON();
};
