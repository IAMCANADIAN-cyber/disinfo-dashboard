/* js/dashboard.js */

(function () {
  /*** GLOBAL INITIALIZATION FLAG ****************************************/
  let dashboardInitialized = false;

  /*** SHARED UTILITIES ***************************************************/
  const $$ = (selector, context = document) => context.querySelector(selector);
  const $$$ = (selector, context = document) => context.querySelectorAll(selector);

  /*** 1.  NETWORK GRAPH (Cytoscape) **************************************/
  function buildNetwork() {
    console.log("Attempting to build network graph with new layout optimizations...");
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
              'label': 'data(label)',
              'background-color': '#4caf50',
              'color': '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '10px',
              'width': '60px',
              'height': '60px'
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#ccc',
              'width': 2,
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#ccc',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '8px',
              'color': '#fff',
              'text-rotation': 'autorotate'
            }
          }
        ],
        layout: {
          name: 'cose',
          padding: 10,
          idealEdgeLength: 100,
          nodeOverlap: 20,
          // OPTIMIZATIONS:
          refresh: 0, // Update screen only when layout is done or significantly changed.
                      // Was 20. 0 should be a big improvement for initial load.
          fit: true,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: 400000,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 500, // Reduced from 1000. Layout will be faster.
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0,
          // animate: false // As a last resort, disable animation during layout.
                           // true by default for cose. For cose-bilkent it's 'end'.
                           // If set to false, might also need to adjust refresh.
        }
      });
      console.log("Network graph built successfully.");

      // Optional: Listen for layout stop to confirm it finishes
      cy.on('layoutstop', function(){
        console.log('Cytoscape layout has stopped.');
      });
      cy.on('layoutstart', function(){
        console.log('Cytoscape layout has started.');
      });


      return cy;
    } catch (e) {
      console.error("Error initializing Cytoscape:", e);
    }
  }

  /*** 2.  TIMELINE CHART (Chart.js) ***************************************/
  function buildTimeline() {
    console.log("Attempting to build timeline chart...");
    const timelineCtx = $$('#timelineChart');
    if (!timelineCtx) {
      console.error("Timeline chart canvas #timelineChart not found.");
      return;
    }
    try {
      const chart = new Chart(timelineCtx, {
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
          maintainAspectRatio: false,
          animation: { // Reduce chart.js animation intensity if needed
            duration: 500 // default is 1000ms
          },
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
      console.log("Timeline chart built successfully.");
      return chart;
    } catch (e) {
      console.error("Error initializing Timeline Chart:", e);
    }
  }

  /*** 3.  BOT ACTIVITY HEATMAP (Chart.js Bar Chart) ************************/
  function buildBotHeatmap() {
    console.log("Attempting to build bot heatmap chart...");
    const heatmapCtx = $$('#botHeatmap');
    if (!heatmapCtx) {
      console.error("Bot heatmap canvas #botHeatmap not found.");
      return;
    }
    try {
      const chart = new Chart(heatmapCtx, {
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
          animation: { // Reduce chart.js animation intensity if needed
            duration: 500 // default is 1000ms
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#e4e4e4' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
              ticks: { color: '#e4e4e4' },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { labels: { color: '#e4e4e4' } }
          }
        }
      });
      console.log("Bot heatmap chart built successfully.");
      return chart;
    } catch (e) {
      console.error("Error initializing Bot Heatmap Chart:", e);
    }
  }

  /*** 4.  TOOL-TIPS (Tippy.js) ********************************************/
  function enableTooltips() {
    console.log("Attempting to enable tooltips...");
    try {
      if (typeof tippy === 'function') {
        tippy('.tooltip-.icon', {
            theme: 'light',
            animation: 'scale',
            allowHTML: true
        });
        console.log("Tooltips enabled successfully.");
      } else {
        console.warn('Tippy.js not loaded – tool-tips disabled');
      }
    } catch (e) {
      console.error("Error initializing Tippy.js tooltips:", e);
    }
  }

  /*** 5.  NLP COMPARE BUTTON *********************************************/
  function wireNlpCompare() {
    console.log("Attempting to wire NLP compare button...");
    const nlpSection = $$('#nlp');
    if (!nlpSection) {
        console.error("NLP section #nlp not found.");
        return;
    }
    const textAreas = $$$('textarea', nlpSection);
    const compareButton = $$('button', nlpSection);

    if (textAreas.length < 2 || !compareButton) {
        console.error("Could not find all elements for NLP comparison (needs 2 textareas and 1 button).");
        return;
    }
    const [leftTextArea, rightTextArea] = textAreas;

    compareButton.addEventListener('click', () => {
      const text1 = leftTextArea.value;
      const text2 = rightTextArea.value;
      if (!text1.trim() || !text2.trim()) {
        alert("Please paste text into both areas for comparison.");
        return;
      }
      const similarityScore = (Math.random() * 100).toFixed(1);
      alert(`🤖 (Placeholder) Narrative Similarity Score: ${similarityScore}%\n\nComparing:\nText 1: "${text1.substring(0,30)}..."\nText 2: "${text2.substring(0,30)}..."`);
    });
    console.log("NLP compare button wired successfully.");
  }

  /*** 6.  INITIALIZE ALL COMPONENTS ON DOMREADY *********************************/
  document.addEventListener('DOMContentLoaded', () => {
    if (dashboardInitialized) {
      console.warn("Dashboard already initialized. Skipping duplicate initialization.");
      return;
    }
    dashboardInitialized = true;

    console.log("DOM fully loaded and parsed. Initializing dashboard components...");
    try {
      buildNetwork();
      buildTimeline();
      buildBotHeatmap();
      enableTooltips();
      wireNlpCompare();
      console.log("Dashboard components initialization process completed.");
    } catch (e) {
      console.error("Critical error during dashboard components initialization:", e);
    }
  });

})();
