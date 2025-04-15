document.addEventListener("DOMContentLoaded", function () {
    const speedChart = new Chart(document.getElementById("speedChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Speed",
                    data: [],
                    backgroundColor: [],
                },
            ],
        },
    });

    const donutChart = new Chart(document.getElementById("donutChart"), {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Types",
                    data: [],
                    backgroundColor: [],
                },
            ],
        },
    });

    const typeChart = new Chart(document.getElementById("typeChart"), {
        type: "pie",
        data: {
            labels: ["Attack", "Defense", "Speed"],
            datasets: [
                {
                    label: "Stats",
                    data: [0, 0, 0],
                    backgroundColor: ["#FF5733", "#36A2EB", "#FF9B17"],
                },
            ],
        },
    });

    // Clear oude data
    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.data.datasets[0].backgroundColor = [];

    donutChart.data.labels = [];
    donutChart.data.datasets[0].data = [];
    donutChart.data.datasets[0].backgroundColor = [];

    typeChart.data.datasets[0].data = [0, 0, 0];

    const typeTeller = {};
    let totaalStats = {
        attack: 0,
        defense: 0,
        speed: 0,
    };

    let counter = 0;
    const totalToLoad = 10;

    for (let i = 0; i < totalToLoad; i++) {
        const randomID = Math.floor(Math.random() * 151) + 1;
        getPokemon(randomID);
    }

    function getPokemon(id) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                const name = data.name;
                const speed = data.stats.find(stat => stat.stat.name === "speed").base_stat;
                const attack = data.stats.find(stat => stat.stat.name === "attack").base_stat;
                const defense = data.stats.find(stat => stat.stat.name === "defense").base_stat;
                const types = data.types.map(t => t.type.name);

                console.log(`Naam: ${name} | Speed: ${speed} | Attack: ${attack} | Defense: ${defense} | Types: ${types.join(", ")}`);

                
                speedChart.data.labels.push(name);
                speedChart.data.datasets[0].data.push(speed);
                speedChart.data.datasets[0].backgroundColor.push(getRandomColor());

                
                types.forEach(type => {
                    typeTeller[type] = (typeTeller[type] || 0) + 1;
                });

                
                totaalStats.attack += attack;
                totaalStats.defense += defense;
                totaalStats.speed += speed;

                counter++;
                if (counter === totalToLoad) {
                    updateCharts();
                }
            })
    }

    function updateCharts() {
        speedChart.update();

        
        donutChart.data.labels = Object.keys(typeTeller);
        donutChart.data.datasets[0].data = Object.values(typeTeller);
        donutChart.data.datasets[0].backgroundColor = Object.keys(typeTeller).map(() => getRandomColor());
        donutChart.update();

        
        typeChart.data.datasets[0].data = [
            totaalStats.attack,
            totaalStats.defense,
            totaalStats.speed,
        ];
        typeChart.update();
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
