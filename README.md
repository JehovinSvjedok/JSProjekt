# Car Rental System

This is a simple car rental system built with Node.js, SQLite, and vanilla JavaScript. It allows users to view available cars, and administrators to manage cars, customers, and rentals.

## Project Structure

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd car_rent
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Ensure you have a SQLite database file named `baza1.db` in the [Database](http://_vscodecontentref_/6) directory.

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. Open your browser and navigate to [http://localhost:8080](http://_vscodecontentref_/7) to view the main page.

3. Navigate to [http://localhost:8080/admin](http://_vscodecontentref_/8) to access the admin dashboard.

## Endpoints

### Main Page

- `GET /`: Serves the main page where users can view available cars.

### Admin Dashboard

- `GET /admin`: Serves the admin dashboard for managing cars, customers, and rentals.

### Static Files

- `GET /style.css`: Serves the CSS file.
- `GET /scriptadmin.js`: Serves the JavaScript file for the admin dashboard.

### API Endpoints

- `GET /cars`: Fetches all cars or a specific car if [car_id](http://_vscodecontentref_/9) is provided.
- `POST /cars`: Adds a new car.
- `PUT /cars/:car_id`: Updates an existing car.
- `DELETE /cars`: Deletes a car by [car_id](http://_vscodecontentref_/10).

- `GET /customers`: Fetches all customers.
- `POST /customers`: Adds a new customer.
- `PUT /customers`: Updates an existing customer by [customer_id](http://_vscodecontentref_/11).
- `DELETE /customers`: Deletes a customer by [customer_id](http://_vscodecontentref_/12).

- `GET /rentals`: Fetches all rentals or a specific rental if [rental_id](http://_vscodecontentref_/13) is provided.
- `POST /rentals`: Adds a new rental.
- `PUT /rentals`: Updates an existing rental by [rental_id](http://_vscodecontentref_/14).
- `DELETE /rentals`: Deletes a rental by [rental_id](http://_vscodecontentref_/15).

## License

This project is licensed under the ISC License.
