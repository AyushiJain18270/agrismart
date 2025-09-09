class AgriSmartDashboard {
  constructor() {
    this.chart = null;
    this.isSprayActive = false;
    this.isAutoMode = false;
    
    // Sample data
    this.sensorData = {
      temperature: 24,
      humidity: 68,
      soilMoisture: 45,
      batteryLevel: 92
    };
    
    this.weatherData = {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10
    };
    
    this.chartData = {
      infection: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12, 8, 15, 6, 10, 4],
        label: 'Infection Rate (%)',
        color: 'hsl(0, 75%, 55%)'
      },
      usage: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [25, 30, 22, 35, 28, 32],
        label: 'Pesticide Usage (L)',
        color: 'hsl(120, 65%, 25%)'
      }
    };
  }

  init() {
    this.setupEventListeners();
    this.initChart();
    this.switchChart('infection'); 
    this.updateProgressBars();
    this.updateWeatherDisplay();
    this.startAutoUpdate();
    this.animateCards();
    this.stopSpray();

  }

  setupEventListeners() {
    // Auto mode toggle
    const autoModeToggle = document.getElementById('auto-mode-toggle');
    if (autoModeToggle) {
      autoModeToggle.addEventListener('change', (e) => {
        this.isAutoMode = e.target.checked;
        this.addNotification(
          `Auto mode ${this.isAutoMode ? 'enabled' : 'disabled'}`,
          'now',
          'info'
        );
      });
    }

    // Spray button
    const sprayButton = document.getElementById('spray-button');
    const sprayStatus = document.getElementById('spray-status');
    
    if (sprayButton) {
      sprayButton.addEventListener('click', () => {
        this.isSprayActive = !this.isSprayActive;
        
        if (this.isSprayActive) {
          sprayButton.classList.add('active');
          sprayButton.innerHTML = '<span class="button-icon">⏹</span><span class="button-text">STOP SPRAY</span>';
          sprayStatus.style.display = 'block';
          
          this.addNotification('Spray system activated', 'now', 'success');
          
          // Auto-stop after 3 seconds for demo
          setTimeout(() => {
            if (this.isSprayActive) {
              this.stopSpray();
            }
          }, 3000);
        } else {
          this.stopSpray();
        }
      });
    }

    // Chart tabs
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const chartType = tab.dataset.chart;
        this.switchChart(chartType);
        
        // Update active tab
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // Refresh camera button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.addNotification('Camera feed refreshed', 'now', 'info');
      });
    }
  }

  stopSpray() {
    const sprayButton = document.getElementById('spray-button');
    const sprayStatus = document.getElementById('spray-status');
    
    this.isSprayActive = false;
    sprayButton.classList.remove('active');
    sprayButton.innerHTML = '<span class="button-icon">💦</span><span class="button-text">START SPRAY</span>';
    sprayStatus.style.display = 'none';
    
    this.addNotification('Spray completed successfully', 'now', 'success');
  }

  updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const progress = bar.dataset.progress;
      if (progress) {
        // Animate progress bar
        setTimeout(() => {
          bar.style.width = `${progress}%`;
        }, 100);
      }
    });
  }

  updateWeatherDisplay() {
    const elements = {
      temperature: document.getElementById('temperature'),
      condition: document.getElementById('weather-condition'),
      humidity: document.getElementById('humidity'),
      windSpeed: document.getElementById('wind-speed'),
      visibility: document.getElementById('visibility')
    };

    if (elements.temperature) elements.temperature.textContent = `${this.weatherData.temperature}°C`;
    if (elements.condition) elements.condition.textContent = this.weatherData.condition;
    if (elements.humidity) elements.humidity.textContent = `${this.weatherData.humidity}%`;
    if (elements.windSpeed) elements.windSpeed.textContent = `${this.weatherData.windSpeed} km/h`;
    if (elements.visibility) elements.visibility.textContent = `${this.weatherData.visibility} km`;
  }

  updateSensorData() {
    // Simulate sensor data changes
    this.sensorData.temperature = Math.round((22 + Math.random() * 6) * 10) / 10;
    this.sensorData.humidity = Math.round((60 + Math.random() * 20) * 10) / 10;
    this.sensorData.soilMoisture = Math.round((40 + Math.random() * 30) * 10) / 10;
    this.sensorData.batteryLevel = Math.max(85, Math.round((this.sensorData.batteryLevel - Math.random() * 0.5) * 10) / 10);

    // Update UI
    const elements = {
      temperature: document.getElementById('sensor-temp'),
      humidity: document.getElementById('sensor-humidity'),
      soilMoisture: document.getElementById('soil-moisture'),
      batteryLevel: document.getElementById('battery-level')
    };

    if (elements.temperature) elements.temperature.textContent = `${this.sensorData.temperature}°C`;
    if (elements.humidity) elements.humidity.textContent = `${this.sensorData.humidity}%`;
    if (elements.soilMoisture) elements.soilMoisture.textContent = `${this.sensorData.soilMoisture}%`;
    if (elements.batteryLevel) elements.batteryLevel.textContent = `${this.sensorData.batteryLevel}%`;

    // Update progress bars
    this.updateProgressBars();

    // Random alerts
    if (Math.random() < 0.1) {
      if (this.sensorData.soilMoisture < 30) {
        this.addNotification('Low soil moisture detected', '1 min ago', 'warning');
      } else if (this.sensorData.batteryLevel < 20) {
        this.addNotification('Battery level low', '2 min ago', 'warning');
      }
    }
  }

  initChart() {
    const ctx = document.getElementById('analytics-chart');
    if (!ctx) return;

    const currentData = this.chartData.infection;
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: [{
          label: currentData.label,
          data: currentData.data,
          borderColor: currentData.color,
          backgroundColor: currentData.color + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: currentData.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'hsl(120, 20%, 90%)',
              borderColor: 'hsl(120, 20%, 80%)'
            },
            ticks: {
              color: 'hsl(120, 10%, 45%)'
            }
          },
          x: {
            grid: {
              color: 'hsl(120, 20%, 90%)',
              borderColor: 'hsl(120, 20%, 80%)'
            },
            ticks: {
              color: 'hsl(120, 10%, 45%)'
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8
          }
        }
      }
    });
  }

  switchChart(chartType) {
    if (!this.chart || !this.chartData[chartType]) return;

    const newData = this.chartData[chartType];
    
    this.chart.data.labels = newData.labels;
    this.chart.data.datasets[0].data = newData.data;
    this.chart.data.datasets[0].label = newData.label;
    this.chart.data.datasets[0].borderColor = newData.color;
    this.chart.data.datasets[0].backgroundColor = newData.color + '20';
    this.chart.data.datasets[0].pointBackgroundColor = newData.color;
    
    this.chart.update('active');
  }

  addNotification(text, time, type = 'info') {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;

    const icons = {
      success: '✓',
      warning: '⚠',
      info: 'ℹ',
      danger: '✖'
    };

    const notification = document.createElement('div');
    notification.className = `notification-item ${type} fade-in`;
    notification.innerHTML = `
      <span class="notification-icon">${icons[type]}</span>
      <div class="notification-content">
        <h4>System Alert</h4>
        <p>${text}</p>
        <span class="notification-time">${time}</span>
      </div>
    `;

    // Add to top of list
    notificationsList.insertBefore(notification, notificationsList.firstChild);

    // Remove oldest if more than 5 notifications
    const notifications = notificationsList.querySelectorAll('.notification-item');
    if (notifications.length > 5) {
      notificationsList.removeChild(notifications[notifications.length - 1]);
    }

    // Update notification count
    const countBadges = document.querySelectorAll('.count-badge, .badge');
    countBadges.forEach(badge => {
      const currentCount = parseInt(badge.textContent) || 0;
      badge.textContent = Math.min(currentCount + 1, 9);
    });
  }

  animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in');
      }, index * 100);
    });
  }

  startAutoUpdate() {
    // Update sensor data every 30 seconds
    setInterval(() => {
      this.updateSensorData();
    }, 30000);

    // Update weather every 5 minutes
    setInterval(() => {
      this.weatherData.temperature = Math.round((25 + Math.random() * 8) * 10) / 10;
      this.weatherData.humidity = Math.round((60 + Math.random() * 20) * 10) / 10;
      this.updateWeatherDisplay();
    }, 300000);

    // Random notifications
    setInterval(() => {
      if (Math.random() < 0.3) {
        const messages = [
          'System health check completed',
          'Sensor calibration successful',
          'Weather data updated',
          'Tank level monitored'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.addNotification(randomMessage, 'now', 'info');
      }
    }, 120000);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new AgriSmartDashboard();
  dashboard.init();
});