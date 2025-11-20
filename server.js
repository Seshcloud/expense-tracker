const express = require("express");
const app = express();
const db = require("./database.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
const HTTP_PORT = 3000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// API Endpoints
// Get all expenses
app.get("/api/expenses", (req, res, next) => {
    const sql = "SELECT * FROM expenses ORDER BY id DESC";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});
// Add new expense
app.post("/api/expenses", (req, res, next) => {
    const errors = [];
    if (!req.body.description){
        errors.push("No description specified");
    }
    if (!req.body.amount){
        errors.push("No amount specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    
    const data = {
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date || new Date().toISOString().split('T')[0],
        icon: req.body.icon || "💸"
    }
    
    const sql = 'INSERT INTO expenses (description, amount, date, icon) VALUES (?,?,?,?)';
    const params = [data.description, data.amount, data.date, data.icon];
    
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        });
    });
});
// Delete expense
app.delete("/api/expenses/:id", (req, res, next) => {
    db.run(
        'DELETE FROM expenses WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message});
                return;
            }
            res.json({"message":"deleted", changes: this.changes});
    });
});
