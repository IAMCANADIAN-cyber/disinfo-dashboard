/* js/dashboard.js */

(function () {
  /*** SHARED UTILITIES ***************************************************/
  // Helper to select DOM elements
  const $$ = (selector, context = document) => context.querySelector(selector);
  const $$$ = (selector, context = document) => context.querySelectorAll(selector);


  /*** 1.  NETWORK GRAPH (Cytoscape) **************************************/
  function buildNetwork() {
    const cyContainer = $$('#cy');
    if (!cyContainer) {
      console.error("Cytoscape container #cy not found.");
      return;
    }
    try {
      const cy = cytoscape({
        container: cyContainer,
        elements: [
          { data: { id: 'RT', label: 'RT News' } },
          { data: { id: 'GlobalResearch', label: 'Global Research' } },
          { data: { id: 'CanadaProud', label: 'Canada Proud' } },
          { data: { id: 'Sputnik', label: 'Sputnik' } },
          { data: { id: 'RebelNews', label: 'Rebel News' } },
          { data: { source: 'RT', target: 'GlobalResearch', label: 'Shares Content' } },
          { data: { source: 'Sputnik', target: 'GlobalResearch', label: 'Cross-posts' } },
          { data: { source: 'GlobalResearch', target: 'CanadaProud', label: 'Influences Narrative' } },
          { data: { source: 'GlobalResearch', target: 'RebelNews', label: 'Cited By' } }
        ],
        style: [
          { 
            selector: 'node',
            style: {
              'label': 'data(label)', // Use 'data(label)' for node text
              'background-color': '#4caf50',
              'color': '#fff', // Text color for the label
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '10px',
              'width': '60px', // Adjust node size
              'height': '60px' // Adjust node size
            }
          },
          { 
            selector: 'edge',
            style: { 
              'line-color': '#ccc', 
              'width': 2,
              'target-arrow-shape': 'triangle', // Add arrows to edges
              'target-arrow-color': '#ccc',
              'curve-style': 'bezier', // Make edges curved for better readability
              'label': 'data(label)', // Display edge labels
              'font-size': '8px',
              'color': '#fff',
              'text-rotation': 'autorotate'
            }
          }
        ],
        layout: { 
          name: 'cose', //cose layout often works well for complex graphs
          // name: 'circle', // As per original
          // name: 'dagre', // If using cytoscape-dagre, ensure it's initialized if needed
          padding: 10,
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: function( node ){ return 400000; },
          edgeElasticity: function( edge ){ return 100; },
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        }
      });
      return cy;
    } catch (e) {
      console.error("Error initializing Cytoscape:", e);
    }
  }

  /*** 2.  TIMELINE CHART (Chart.js) ***************************************/
  function buildTimeline() {
    const timelineCtx = $$('#timelineChart');
    if (!timelineCtx) {
      console.error("Timeline chart canvas #timelineChart not found.");
      return;
    }
    try {
      return new Chart(timelineCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [{
            label: 'Disinformation Narrative Spike',
            data:  [10, 30, 75, 40, 60, 25],
            borderColor:   'rgba(75, 192, 192, 0.85)',
            backgroundColor: 'rgba(75, 192, 192, 0.20)',
            fill: true,
            tension: 0.4
          }, {
            label: 'Counter-Narrative Mentions',
            data: [5, 15, 40, 80, 50, 30],
            borderColor: 'rgba(255, 99, 132, 0.85)',
            backgroundColor: 'rgba(255, 99, 132, 0.20)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: false, // Allow chart to not maintain aspect ratio
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#e4e4e4' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: '#e4e4e4' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          },
          plugins: {
            legend: { labels: { color: '#e4e4e4' } }
          }
        }
      });
    } catch (e) {
      console.error("Error initializing Timeline Chart:", e);
    }
  }

  /*** 3.  BOT ACTIVITY HEATMAP (Chart.js Bar Chart) ************************/
  function buildBotHeatmap() {
    const heatmapCtx = $$('#botHeatmap');
    if (!heatmapCtx) {
      console.error("Bot heatmap canvas #botHeatmap not found.");
      return;
    }
    try {
      return new Chart(heatmapCtx, {
        type: 'bar',
        data: {
          labels: ['12 AM','3 AM','6 AM','9 AM','12 PM','3 PM','6 PM','9 PM'],
          datasets: [{
            label: 'Detected Bot Posts',
            data:  [5, 8, 12, 25, 30, 40, 38, 22],
            backgroundColor: 'rgba(255, 159, 64, 0.70)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#e4e4e4' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: '#e4e4e4' },
              grid: { display: false } // Hide X-axis grid lines for bar chart if preferred
            }
          },
          plugins: {
            legend: { labels: { color: '#e4e4e4' } }
          }
        }
      });
    } catch (e) {
      console.error("Error initializing Bot Heatmap Chart:", e);
    }
  }

  /*** 4.  TOOL-TIPS (Tippy.js) ********************************************/
  function enableTooltips() {
    try {
      if (typeof tippy === 'function') {
        tippy('.tooltip-icon', { 
            theme: 'light', 
            animation: 'scale',
            allowHTML: true // If data-tippy-content contains HTML
        });
      } else {
        console.warn('Tippy.js not loaded – tool-tips disabled');
      }
    } catch (e) {
      console.error("Error initializing Tippy.js tooltips:", e);
    }
  }

  /*** 5.  NLP COMPARE BUTTON *********************************************/
  function wireNlpCompare() {
    const nlpSection = $$('#nlp');
    if (!nlpSection) {
        console.error("NLP section #nlp not found.");
        return;
    }
    const [leftTextArea, rightTextArea] = $$$('textarea', nlpSection);
    const compareButton = $$('button', nlpSection);

    if (!leftTextArea || !rightTextArea || !compareButton) {
        console.error("Could not find all elements for NLP comparison.");
        return;
    }

    compareButton.addEventListener('click', () => {
      const text1 = leftTextArea.value;
      const text2 = rightTextArea.value;
      if (!text1.trim() || !text2.trim()) {
        alert("Please paste text into both areas for comparison.");
        return;
      }
      // Placeholder for actual NLP comparison
      const similarityScore = (Math.random() * 100).toFixed(1);
      alert(`🤖 (Placeholder) Narrative Similarity Score: ${similarityScore}%\n\nComparing:\nText 1: "${text1.substring(0,30)}..."\nText 2: "${text2.substring(0,30)}..."`);
      // TODO: Replace with a real NLP back-end call or client-side library
    });
  }

  /*** 6.  INITIALIZE ALL COMPONENTS ON DOMREADY *********************************/
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Initializing dashboard components.");
    try {
      buildNetwork();
      buildTimeline();
      buildBotHeatmap();
      enableTooltips();
      wireNlpCompare();
      console.log("Dashboard components initialization attempted.");
    } catch (e) {
      console.error("Error during dashboard initialization:", e);
    }
  });

})(); // IIFE to avoid polluting global scope