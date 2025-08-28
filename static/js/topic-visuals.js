// Fetch sample data for the current topic and render an interactive Plotly visualization.
function init() {
    let data;
    try {
        const dataEl = document.getElementById('plot-data');
        const dataSpec = JSON.parse(dataEl.innerText || '{}');
        console.log('dataSpec:', dataSpec);

        if (dataSpec.type === 'linear') {
            // synthesize sample points in browser for responsiveness (backend can also do this server-side)
            const n = dataSpec.n || 50;
            const slope = dataSpec.slope ?? 2.5;
            const intercept = dataSpec.intercept ?? 4.0;
            const noise = dataSpec.noise ?? 6.0;
            const x = Array.from({length:n}, (_,i)=> i*(10/(n-1)) );
            const y = x.map(xx => slope*xx + intercept + (Math.random()*2-1)*noise );
            data = { x, y };
        } else if (dataSpec.type === 'scatter') {
            data = dataSpec.data || { x: [], y: [] };
        } else if (dataSpec.type === 'classification') {
            // Generate synthetic classification data
            const n = dataSpec.n || 100;
            const data_range = dataSpec.data_range || [-10, 10];
            const x1 = Array.from({length:n}, () => Math.random() * (data_range[1] - data_range[0]) + data_range[0]);
            const x2 = Array.from({length:n}, () => Math.random() * (data_range[1] - data_range[0]) + data_range[0]);
            const labels = x1.map((val, i) => (val + x2[i] > 0 ? 1 : 0)); // Simple linear separation
            data = {
                x: x1,
                y: x2,
                labels: labels
            };
        } else {
            data = { x: [], y: [] };
        }

        // Ensure data.x and data.y are always arrays for Plotly
        data.x = data.x || [];
        data.y = data.y || [];
        console.log('Processed data:', data);

        // initial render
        const slopeEl = document.getElementById('slope');
        const interceptEl = document.getElementById('intercept');
        const noiseEl = document.getElementById('noise');
        const regenBtn = document.getElementById('regen');

        function currentParams(){
            return { slope: parseFloat(slopeEl.value), intercept: parseFloat(interceptEl.value), noise: parseFloat(noiseEl.value) }
        }

        function reRender(){
            const p = currentParams();
            if (dataSpec.type === 'linear'){
                // create noisy y based on slope/intercept/noise
                const x = data.x;
                const y = x.map(xx => p.slope*xx + p.intercept + (Math.random()*2-1)*p.noise);
                renderPlot({x,y}, p.slope, p.intercept, p.noise);
            } else if (dataSpec.type === 'classification') {
                // Regenerate classification data based on current parameters
                const n = dataSpec.n || 100;
                const data_range = dataSpec.data_range || [-10, 10];
                const x1 = Array.from({length:n}, () => Math.random() * (data_range[1] - data_range[0]) + data_range[0]);
                const x2 = Array.from({length:n}, () => Math.random() * (data_range[1] - data_range[0]) + data_range[0]);
                const labels = x1.map((val, i) => (val * p.slope + x2[i] + p.intercept + (Math.random()*2-1)*p.noise > 0 ? 1 : 0));
                const newData = {
                    x: x1,
                    y: x2,
                    labels: labels
                };
                renderPlot(newData, p.slope, p.intercept, p.noise);
            } else {
                renderPlot(data, p.slope, p.intercept, p.noise);
            }
        }

        slopeEl.addEventListener('input', reRender);
        interceptEl.addEventListener('input', reRender);
        noiseEl.addEventListener('input', reRender);
        regenBtn.addEventListener('click', reRender);

        // initial
        renderPlot(data, parseFloat(slopeEl.value), parseFloat(interceptEl.value), parseFloat(noiseEl.value));

    } catch(err){
        console.error(err);
        document.getElementById('plot-area').innerText = 'Failed to load visualization.';
    }
}

function renderPlot(data, slope, intercept, noise) {
    const plotArea = document.getElementById('plot-area');
    let traces = [];

    let plotTitle = 'Visualization';

    if (data.labels) {
        plotTitle = 'Classification';
        // Classification plot
        const class0_x = [];
        const class0_y = [];
        const class1_x = [];
        const class1_y = [];

        for (let i = 0; i < data.labels.length; i++) {
            if (data.labels[i] === 0) {
                class0_x.push(data.x[i]);
                class0_y.push(data.y[i]);
            } else {
                class1_x.push(data.x[i]);
                class1_y.push(data.y[i]);
            }
        }

        traces.push({
            x: class0_x,
            y: class0_y,
            mode: 'markers',
            type: 'scatter',
            name: 'Class 0',
            marker: { color: 'blue', symbol: 'circle' }
        });

        traces.push({
            x: class1_x,
            y: class1_y,
            mode: 'markers',
            type: 'scatter',
            name: 'Class 1',
            marker: { color: 'red', symbol: 'x' }
        });

    } else {
        // Linear regression or scatter plot
        traces.push({
            x: data.x,
            y: data.y,
            mode: 'markers',
            type: 'scatter',
            name: 'Sample Data'
        });
        plotTitle = 'Linear Regression'; // Set title for linear regression
    }

    const layout = {
        title: 'Linear Regression',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        shapes: []
    };

    if (!data.labels && data.x && data.x.length > 1 && slope !== undefined && intercept !== undefined) {
        const x_min = Math.min(...data.x);
        const x_max = Math.max(...data.x);
        const y_min_line = slope * x_min + intercept;
        const y_max_line = slope * x_max + intercept;

        layout.shapes.push({
            type: 'line',
            x0: x_min,
            y0: y_min_line,
            x1: x_max,
            y1: y_max_line,
            line: {
                color: 'red',
                width: 2
            }
        });
    }

    if (data.labels && slope !== undefined && intercept !== undefined) {
        // Add decision boundary for classification
        const x_min = Math.min(...data.x);
        const x_max = Math.max(...data.x);

        // y = -slope * x - intercept
        const y_min_line = -slope * x_min - intercept;
        const y_max_line = -slope * x_max - intercept;

        layout.shapes.push({
            type: 'line',
            x0: x_min,
            y0: y_min_line,
            x1: x_max,
            y1: y_max_line,
            line: {
                color: 'green',
                width: 2,
                dash: 'dash'
            }
        });
    }

    layout.title = plotTitle;

    Plotly.newPlot(plotArea, traces, layout);
}

init();