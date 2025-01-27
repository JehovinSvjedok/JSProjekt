async function loadCars() {
    const response = await fetch('/cars');
    const cars = await response.json();
    const table = document.getElementById('carTable');
    const carSelect = document.getElementById('carSelect');
    carSelect.innerHTML = '<option value="" disabled selected>Select a car</option>';
    table.innerHTML = `
        <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>License Plate</th>
            <th>Availability</th>
            <th>Daily Rate</th>
            <th>Actions</th>
        </tr>
    `;
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.car_id;
        option.textContent = `${car.make} ${car.model} (${car.year}) - ${car.license_plate}`;
        carSelect.appendChild(option);
        const row = table.insertRow();
        row.innerHTML = `
            <td>${car.make}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.license_plate}</td>
            <td>${car.availability ? 'Available' : 'Not Available'}</td>
            <td>${car.daily_rate}</td>
            <td>
                <div class="button-container">
                    <button onclick="deleteCar('${car.car_id}')">Delete</button>
                    <button onclick="urediAuto(${car.car_id}, '${car.make}', '${car.model}', ${car.year}, '${car.license_plate}', ${car.availability}, ${car.daily_rate})">Edit</button>
                    </div>
            </td>
        `;
    });
}

async function loadCustomers() {
    const response = await fetch('/customers');
    const customers = await response.json();
    const table = document.getElementById('customerTable');
    const customerSelect = document.getElementById('customerSelect');
    customerSelect.innerHTML = '<option value="" disabled selected>Select a customer</option>';
    table.innerHTML = `
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Drivers license</th>
            <th>Actions</th>
        </tr>
    `;
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.customer_id;
        option.textContent = `${customer.first_name} ${customer.last_name} - ${customer.email}`;
        customerSelect.appendChild(option);
        const row = table.insertRow();
        row.innerHTML = `
            <td>${customer.first_name}</td>
            <td>${customer.last_name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone_number}</td>
            <td>${customer.drivers_license}</td>
            <td>
                <div class="button-container">
                    <button onclick="deleteCustomer('${customer.customer_id}')">Delete</button>
                    <button onclick="urediCustomer('${customer.customer_id}', '${customer.first_name}', '${customer.last_name}', '${customer.email}', '${customer.phone_number}', '${customer.drivers_license}')">Edit</button>
                </div>
            </td>
        `;
    });

}

async function loadRentals() {
    const response = await fetch('/rentals');
    const rentals = await response.json();
    console.log("Loaded rentals:", rentals);
    const table = document.getElementById('rentalTable');
    table.innerHTML = `
        <tr>
            <th>Car Make</th>
            <th>Car Model</th>
            <th>Customer Name</th>
            <th>Rental Date</th>
            <th>Return Date</th>
            <th>Total Cost</th>
            <th>Actions</th>
        </tr>
    `;
    rentals.forEach(rental => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${rental.car_make}</td>
            <td>${rental.car_model}</td>
            <td>${rental.customer_name}</td>
            <td>${rental.rental_date}</td>
            <td>${rental.return_date || 'Not Returned'}</td>
            <td>${rental.total_cost}</td>
            <td>
                <div class="button-container">
                    <button onclick="deleteRental('${rental.rental_id}')">Delete</button>
                    <button onclick="console.log('Edit button clicked');urediRental('${rental.rental_id}','${rental.car_id}', '${rental.customer_id}', '${rental.rental_date}', '${rental.return_date || 'Not Returned'}', '${rental.total_cost}')">Edit</button>
                </div>
            </td>
        `;
    });

}
incrementCounter = (function() {
    let counter = 3;
    return function() {
        counter++;
        return counter;
    }
})();
decrementCounter = function () {
    if (counter > 0) counter--;
    return counter;
};
async function addCar(event) {
    event.preventDefault();
    const form = document.getElementById('carForm');
    const formData = new FormData(form);
    const carData = {
        car_id: incrementCounter(),
        make: formData.get('make'),
        model: formData.get('model'),
        year: formData.get('year'),
        license_plate: formData.get('license_plate'),
        availability: formData.get('availability') === '1',
        daily_rate: parseFloat(formData.get('daily_rate'))
    };

    const response = await fetch('/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    });

    if (response.ok) {
        loadCars();
        form.reset();
    } 
}

incrementCounter2 = (function() {
    let counter2 = 0;
    return function() {
        counter2++;
        return counter2;
    }
})();
decrementCounter2 = function () {
    if (counter2 > 0) counter2--;
    return counter2;
};
async function addCustomer(event) {
    event.preventDefault();
    const form = document.getElementById('customerForm');
    const formData = new FormData(form);
    const customerData = {
        customer_id: incrementCounter2(),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone_number: formData.get('phone_number'),
        drivers_license: formData.get('drivers_license')
    };

    const response = await fetch('/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
    });

    if (response.ok) {
        loadCustomers();
        form.reset();
    } else {
        alert('Error adding customer!');
    }
}
incrementCounter3 = (function() {
    let counter3 = 0;
    return function() {
        counter3++;
        return counter3;
    }
})();
decrementCounter3 = function () {
    if (counter3 > 0) counter3--;
    return counter3;
};
async function addRental(event) {
    event.preventDefault();
    const form = document.getElementById('rentalForm');
    const formData = new FormData(form);
    const rentalData = {
        rental_id: incrementCounter3(),
        car_id: formData.get('car_id'),
        customer_id: formData.get('customer_id'),
        rental_date: formData.get('rental_date'),
        return_date: formData.get('return_date'),
        total_cost: parseFloat(formData.get('total_cost'))
    };

    const response = await fetch('/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rentalData)
    });

    if (response.ok) {
        loadRentals();
        form.reset();
    } else {
        alert('Error adding rental!');
    }
}

window.onload = function() {
    loadCars();
    loadCustomers();
    loadRentals();
};

function urediAuto(car_id, make, model, year, license_plate, availability, daily_rate) {
    document.getElementById('make').value = make;
    document.getElementById('model').value = model;
    document.getElementById('year').value = year;
    document.getElementById('license_plate').value = license_plate;
    document.getElementById('availability').checked = availability;
    document.getElementById('daily_rate').value = daily_rate;

    document.getElementById('submitButton').textContent = 'Save changes';
    document.getElementById('submitButton').onclick = function () {
        spremiPromjene(car_id);
    };
}


function spremiPromjene(car_id) {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = parseInt(document.getElementById('year').value, 10);
    const license_plate = document.getElementById('license_plate').value;
    const availability = document.getElementById('availability').checked;
    const daily_rate = parseFloat(document.getElementById('daily_rate').value);

    fetch(`/cars/${car_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ make, model, year, license_plate, availability, daily_rate }),
    })
        .then((response) => {
            if (response.ok) {
                alert('Car succesfully updated!');
                resetForm2();
                loadCars();
            } else {
                alert('Error.');
            }
        })
        .catch((error) => console.error('Error:', error));
}
function urediCustomer(customer_id, first_name, last_name, email, phone_number, drivers_license) {

    document.getElementById('first_name').value = first_name;
    document.getElementById('last_name').value = last_name;
    document.getElementById('email').value = email;
    document.getElementById('phone_number').value = phone_number;
    

    const driversLicenseField = document.getElementById('drivers_license');
    driversLicenseField.value = drivers_license;
    driversLicenseField.setAttribute('readonly', true);


    const submitButton = document.getElementById('submitButton1');
    submitButton.textContent = 'Save Changes';
    submitButton.onclick = function (event) {
        event.preventDefault(); 
        spremiPromjeneCustomer(customer_id); 
    };
}

function spremiPromjeneCustomer(customer_id) {
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phone_number').value;
    const drivers_license = document.getElementById('drivers_license').value;
    fetch(`/customers?customer_id=${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, phone_number,drivers_license }),
    })
        .then((response) => {
            if (response.ok) {
                alert('Customer updated successfully!');
                resetForm();
                loadCustomers(); 
            } else {
                alert('Error updating customer.');
            }
        })
        .catch((error) => console.error('Error:', error));
}

async function urediRental(rental_id, car_id, customer_id, rental_date, return_date, total_cost) {
    console.log('urediRental triggered with rental_id:', rental_id);

    document.getElementById('rental_date').value = rental_date;
    document.getElementById('return_date').value = return_date;
    document.getElementById('total_cost').value = total_cost;
    await loadCars();
    await loadCustomers();

    const carSelect = document.getElementById('carSelect');
    const customerSelect = document.getElementById('customerSelect');


    carSelect.value = car_id; 

    customerSelect.value = customer_id; 

    const submitButton = document.getElementById('submitButton2');
    submitButton.textContent = 'Save Changes';
    submitButton.onclick = function (event) {
        event.preventDefault();
        spremiPromjeneRental(rental_id); 
    };
}


function spremiPromjeneRental(rental_id) {
    const car_id = document.getElementById('carSelect').value;  
    const customer_id = document.getElementById('customerSelect').value;  
    const rental_date = document.getElementById('rental_date').value;  
    const return_date = document.getElementById('return_date').value;  
    const total_cost = document.getElementById('total_cost').value; 

    fetch(`/rentals?rental_id=${rental_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car_id, customer_id, rental_date, return_date, total_cost }),
    })
    .then((response) => {
        if (response.ok) {
            alert('Rental updated successfully!');
            resetForm1();  // Reset the form after update
            loadRentals(); // Reload rentals to reflect changes
        } else {
            alert('Error updating rental.');
        }
    })
    .catch((error) => console.error('Error:', error));
}

function resetForm2() {
    document.getElementById('make').value = '';
    document.getElementById('model').value = '';
    document.getElementById('year').value = '';
    document.getElementById('license_plate').value = '';
    document.getElementById('availability').value = '';
    document.getElementById('daily_rate').value = '';
}


function resetForm1() {
        document.getElementById('rentalForm').reset();  // Resets all form fields to their initial values
        document.getElementById('carSelect').selectedIndex = 0; // Reset car selection dropdown
        document.getElementById('customerSelect').selectedIndex = 0; // Reset customer selection dropdown
}

function resetForm() {
    document.getElementById('customerForm').reset(); 

    const driversLicenseField = document.getElementById('drivers_license');
    driversLicenseField.removeAttribute('readonly'); 
    const submitButton = document.getElementById('submitButton1');
    submitButton.textContent = 'Add Customer';
    submitButton.onclick = addCustomer; 
}
async function deleteCar(carId) {
    if (confirm(`Are you sure you want to delete car with ID: ${carId}?`)) {
        const response = await fetch(`/cars?car_id=${carId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            decrementCounter();
            form.reset();
            loadCars(); 
        } else {
            alert(result.error || 'Failed to delete car.');
        }
    }
}
async function deleteCustomer(customerId) {
    if (confirm(`Are you sure you want to delete customer with ID: ${customerId}?`)) {
        const response = await fetch(`/customers?customer_id=${customerId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            decrementCounter2();
            loadCustomers(); 
        } else {
            alert(result.error || 'Failed to delete customer.');
        }
    }
}

async function deleteRental(rentalId) {
    if (confirm(`Are you sure you want to delete rental with ID: ${rentalId}?`)) {
        const response = await fetch(`/rentals?rental_id=${rentalId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            loadRentals();
            decrementCounter3();
             
        } else {
            alert(result.error || 'Failed to delete rental.');
        }
    }
}
window.onload = function() {
    loadCustomers();
    loadCars();
    loadRentals();
};