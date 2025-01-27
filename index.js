const http = require("http");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const PORT = 8080;


let db;

sqlite.open({ filename: './Database/baza1.db', driver: sqlite3.Database })
    .then(database => {
        db = database;
        console.log("Database connected.");
    })
    .catch(error => {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); 
    });

http.createServer(async (req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const car_id = url.searchParams.get("car_id");
        const rental_id = url.searchParams.get("rental_id");

        if (req.method === "GET" && url.pathname === "/") {
            const html = fs.readFileSync(path.join(__dirname, './public/main.html'), 'utf-8');
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        }
        else if (req.method === "GET" && url.pathname === "/scriptadmin.js") {
            const html = fs.readFileSync(path.join(__dirname, './public/scriptadmin.js'), 'utf-8');
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(html);
        }
        else if (req.method === "GET" && url.pathname === "/style.css") {
            const html = fs.readFileSync(path.join(__dirname, './public/style.css'), 'utf-8');
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(html);
        }
        else if (req.method === "GET" && url.pathname === "/admin") {
            const html = fs.readFileSync(path.join(__dirname, './public/admin.html'), 'utf-8');
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        }

        else if (req.method === "GET" && url.pathname === "/cars") {
            console.log("Handling GET request for Cars...");
            const sql = car_id
                ? "SELECT * FROM Cars WHERE car_id = ?"
                : "SELECT * FROM Cars";
            const result = car_id ? await db.get(sql, [car_id]) : await db.all(sql);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result || []));
        }
        else if (req.method === "GET" && url.pathname === "/customers") {
            console.log("Handling GET request for Customers...");
            const sql = "SELECT * FROM Customers";
            const result = await db.all(sql);
        
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result || []));
        }
        
        else if (req.method === "POST" && url.pathname === "/customers") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    console.log("Request body:", body);  
                    const customer = JSON.parse(body);   
                    const sql = `
                        INSERT INTO Customers (customer_id, first_name, last_name, email, phone_number, "drivers_license")
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
                    await db.run(sql, [
                        customer.customer_id, customer.first_name, customer.last_name,
                        customer.email, customer.phone_number, customer.drivers_license
                    ]);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Customer added successfully!" }));
                } catch (error) {
                    console.error("Error parsing POST body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
            
        }

        else if (req.method === "PUT" && url.pathname === "/customers") {
            const customer_id = url.searchParams.get("customer_id");  
        
            if (!customer_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Customer ID is required for updating." }));
                return;
            }
        
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    const customer = JSON.parse(body);
                    const sql = `
                        UPDATE Customers 
                        SET first_name = ?, last_name = ?, email = ?, phone_number = ?, "drivers_license" = ?
                        WHERE customer_id = ?
                    `;
                    const result = await db.run(sql, [
                        customer.first_name, customer.last_name, customer.email,
                        customer.phone_number, customer.drivers_license, customer_id
                    ]);
        
                    if (result.changes === 0) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Customer not found." }));
                    } else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Customer updated successfully!" }));
                    }
                } catch (error) {
                    console.error("Error parsing PUT body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
        }
        
        else if (req.method === "DELETE" && url.pathname === "/customers") {
            const customer_id = url.searchParams.get("customer_id");  
        
            if (!customer_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Customer ID is required for deletion." }));
                return;
            }
        
            const checkSql = "SELECT * FROM Customers WHERE customer_id = ?";
            const customer = await db.get(checkSql, [customer_id]);
        
            if (!customer) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: `Customer with ID ${customer_id} not found.` }));
            } else {
                const deleteSql = "DELETE FROM Customers WHERE customer_id = ?";
                await db.run(deleteSql, [customer_id]);
        
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: `Customer with ID ${customer_id} deleted successfully.` }));
            }
        }
        else if (req.method === "DELETE" && url.pathname === "/cars") {
            const car_id = url.searchParams.get("car_id"); 
        
            if (!car_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Car ID is required for deletion." }));
                return;
            }
        
            const checkSql = "SELECT * FROM Cars WHERE car_id = ?"; 
            const car = await db.get(checkSql, [car_id]);
        
            if (!car) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: `Car with ID ${car_id} not found.` }));
            } else {
                const deleteSql = "DELETE FROM Cars WHERE car_id = ?"; 
                await db.run(deleteSql, [car_id]);
        
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: `Car with ID ${car_id} deleted successfully.` }));
            }
        }
        
        else if (req.method === "GET" && url.pathname === "/rentals") {
            console.log("Handling GET request for Rentals...");
            const sql = rental_id
                ? `
                    SELECT Rentals.rental_id, Rentals.rental_date, Rentals.return_date, Rentals.total_cost,
                           Cars.make AS car_make, Cars.model AS car_model,
                           Customers.first_name || ' ' || Customers.last_name AS customer_name
                    FROM Rentals
                    JOIN Cars ON Rentals.car_id = Cars.car_id
                    JOIN Customers ON Rentals.customer_id = Customers.customer_id
                    WHERE Rentals.rental_id = ?
                `
                : `
                    SELECT Rentals.rental_id, Rentals.rental_date, Rentals.return_date, Rentals.total_cost,
                           Cars.make AS car_make, Cars.model AS car_model,
                           Customers.first_name || ' ' || Customers.last_name AS customer_name
                    FROM Rentals
                    JOIN Cars ON Rentals.car_id = Cars.car_id
                    JOIN Customers ON Rentals.customer_id = Customers.customer_id
                `;
            const result = rental_id ? await db.get(sql, [rental_id]) : await db.all(sql);
        
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result || []));
        }
        
        else if (req.method === "POST" && url.pathname === "/rentals") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    const rental = JSON.parse(body);
                    const sql = `
                        INSERT INTO Rentals (rental_id, car_id, customer_id, rental_date, return_date, total_cost)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
                    await db.run(sql, [
                        rental.rental_id, rental.car_id, rental.customer_id,
                        rental.rental_date, rental.return_date, rental.total_cost
                    ]);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Rental added successfully!" }));
                } catch (error) {
                    console.error("Error parsing POST body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
        }
        else if (req.method === "DELETE" && url.pathname === "/rentals") {
            if (rental_id) {
                const checkSql = "SELECT * FROM Rentals WHERE rental_id = ?";
                const rental = await db.get(checkSql, [rental_id]);

                if (!rental) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: `Rental with ID ${rental_id} not found.` }));
                } else {
                    const deleteSql = "DELETE FROM Rentals WHERE rental_id = ?";
                    await db.run(deleteSql, [rental_id]);

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: `Rental with ID ${rental_id} deleted successfully.` }));
                }
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Rental ID is required for deletion." }));
            }
        }
        else if (req.method === "PUT" && url.pathname === "/rentals") {
            const rental_id = url.searchParams.get("rental_id");
        
            if (!rental_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Rental ID is required for updating." }));
                return;
            }
        
            let body = "";
            req.on("data", chunk => (body += chunk));
            req.on("end", async () => {
                try {
                    const rental = JSON.parse(body);
                    if (
                        rental.car_id === undefined ||
                        rental.customer_id === undefined ||
                        !rental.rental_date ||
                        !rental.return_date ||
                        rental.total_cost === undefined
                    ) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({
                                error: "All fields (car_id, customer_id, rental_date, return_date, total_cost) are required for updating.",
                            })
                        );
                        return;
                    }
                    const checkSql = "SELECT * FROM Rentals WHERE rental_id = ?";
                    const existingRental = await db.get(checkSql, [rental_id]);
        
                    if (!existingRental) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({ error: `Rental with ID ${rental_id} not found.` })
                        );
                        return;
                    }
        

                    const sql = `
                        UPDATE Rentals 
                        SET car_id = ?, customer_id = ?, rental_date = ?, return_date = ?, total_cost = ?
                        WHERE rental_id = ?
                    `;
        

                    const result = await db.run(sql, [
                        rental.car_id,
                        rental.customer_id,
                        rental.rental_date,
                        rental.return_date,
                        rental.total_cost,
                        rental_id,
                    ]);
        
                    if (result.changes === 0) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({ error: `Rental with ID ${rental_id} not updated.` })
                        );
                    } else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({
                                message: `Rental with ID ${rental_id} updated successfully.`,
                            })
                        );
                    }
                } catch (error) {
                    console.error("Error parsing PUT body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
        }
        
        else if (req.method === "POST" && url.pathname === "/cars") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    const car = JSON.parse(body);
                    const sql = `
                        INSERT INTO Cars (car_id, make, model, year, license_plate, availability, daily_rate)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;
                    await db.run(sql, [
                        car.car_id, car.make, car.model, car.year,
                        car.license_plate, car.availability, car.daily_rate
                    ]);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Car added successfully!" }));
                } catch (error) {
                    console.error("Error parsing POST body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
        }
        else if (req.method === "PUT" && url.pathname.startsWith("/cars/")) {
            const car_id = url.pathname.split("/").pop(); 
        
            if (!car_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Car ID is required for updating." }));
                return;
            }
        
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                try {
                    const car = JSON.parse(body);
        
                    if (!car.make || !car.model || !car.year || !car.license_plate || car.daily_rate === undefined) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "All fields are required for update." }));
                        return;
                    }
        
                    const checkSql = "SELECT * FROM Cars WHERE car_id = ?";
                    const existingCar = await db.get(checkSql, [car_id]);
        
                    if (!existingCar) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: `Car with ID ${car_id} not found.` }));
                        return;
                    }
        
                    const sql = `
                        UPDATE Cars 
                        SET make = ?, model = ?, year = ?, license_plate = ?, availability = ?, daily_rate = ?
                        WHERE car_id = ?
                    `;
        
                    const result = await db.run(sql, [
                        car.make, car.model, car.year, car.license_plate,
                        car.availability !== undefined ? car.availability : existingCar.availability,
                        car.daily_rate, car_id
                    ]);
        
                    if (result.changes === 0) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: `Car with ID ${car_id} not updated.` }));
                    } else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: `Car with ID ${car_id} updated successfully.` }));
                    }
                } catch (error) {
                    console.error("Error parsing PUT body:", error.message);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request body." }));
                }
            });
        }
        
    } catch (error) {
        console.error("Error:", error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}).listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
