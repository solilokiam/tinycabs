function logResponse(res) {
    console.table(res.data);
    console.log(res.data);
    console.log("** Query columns **");
    for (let column of res.meta) {
        console.log(`${column.name} -> ${column.type}`);
    }
}

async function renderFilters() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('start')) {
        const startFilter = document.getElementById('startFilter');
        startFilter.value = params.get('start');
    }

    if (params.has('end')) {
        const endFilter = document.getElementById('endFilter');
        endFilter.value = params.get('end');
    }

    const vendors = await pipe.json({
        q: `SELECT DISTINCT vendorid FROM _`
    })

    if (vendors.error) {
        const errors = document.getElementById('errors');
        errors.innerHTML = `there is a problem running the query: ${operations.error}`;
    } else {
        const vendorSelect = document.getElementById('vendors');
        for (var i = 0; i < vendors.data.length; i++) {
            var vendor = vendors.data[i].vendorid;
            vendorSelect.add(new Option(vendor, vendor, false, vendor == params.get('vendor')))
        }
    }
}

function renderOperations(operations) {
    const operationsTable = document.getElementById('operations');
    if (operations.data.length === 0) {
        var row = operationsTable.insertRow();
        var cell1 = row.insertCell(0);
        cell1.colSpan = 6;
        cell1.innerHTML = 'No rides found';
    } else {
        for (var i = 0; i < operations.data.length; i++) {
            var row = operationsTable.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            cell1.innerHTML = operations.data[i].vendorid;
            cell2.innerHTML = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(operations.data[i].tpep_pickup_datetime));
            cell3.innerHTML = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(operations.data[i].tpep_dropoff_datetime));
            cell4.innerHTML = new Intl.NumberFormat('en-US').format(operations.data[i].passenger_count);
            cell5.innerHTML = new Intl.NumberFormat('en-US').format(operations.data[i].trip_distance);
            cell6.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(operations.data[i].total_amount);
        }
    }
}

function renderSums(sums) {
    document.getElementById('travels').innerHTML = new Intl.NumberFormat('en-US').format(sums.data[0].total_passengers);
    document.getElementById('distance').innerHTML = new Intl.NumberFormat('en-US').format(sums.data[0].total_distance);
    document.getElementById('amount').innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sums.data[0].total_amount);
}

function buildQueryWhere() {
    var params = new URLSearchParams(window.location.search);

    var queryParts = [];

    if (params.has('vendor') && params.get('vendor') != -1) {
        queryParts.push(`vendorid = '${params.get('vendor')}'`);
    }

    if (params.has('start')) {
        var startDate = new Date(params.get('start')).toISOString().slice(0, 19).replace('T', ' ');
        queryParts.push(`tpep_pickup_datetime > '${startDate}'`);
    }

    if (params.has('end')) {
        var endDate = new Date(params.get('end')).toISOString().slice(0, 19).replace('T', ' ');
        queryParts.push(`tpep_dropoff_datetime < '${endDate}'`);
    }

    if (queryParts.length == 0) {
        return '';
    }

    return `WHERE ${queryParts.join(' AND ')}`;
}


async function run() {
    var where = buildQueryWhere();

    var sums = await pipe.json({
        q: `select SUM(passenger_count) as total_passengers, SUM(trip_distance) as total_distance, SUM(total_amount) as total_amount from _ ${where}`
    });

    var operations = await pipe.json({
        q: `SELECT * FROM _ ${where} LIMIT 50`
    })

    if (operations.error) {
        var errors = document.getElementById('errors');
        errors.innerHTML = `there is a problem running the query: ${operations.error}`;
    } else {
        logResponse(operations);
        renderFilters();
        renderOperations(operations);
        renderSums(sums);
    }
}

var tinyb = tinybird('p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c');
var pipe = tinyb.pipe('yellow_tripdata_2017_pipe');

run()
