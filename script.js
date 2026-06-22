// Configuration and local state
let budget = +localStorage.getItem('budget') || 20000;
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let chart, editId = null;

// Helpers
const $ = id => document.getElementById(id);
$('today').innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${new Date().toDateString()}`;

// Map categories to FontAwesome icons and theme colors
const CATEGORY_ICONS = {
  Food: 'fa-utensils',
  Transport: 'fa-car',
  Shopping: 'fa-bag-shopping',
  Entertainment: 'fa-film',
  Bills: 'fa-file-invoice-dollar',
  Other: 'fa-coins'
};

const CATEGORY_COLORS = {
  Food: '#ef4444',          // Red/Rose
  Transport: '#3b82f6',     // Blue
  Shopping: '#a855f7',      // Purple
  Entertainment: '#ec4899', // Pink
  Bills: '#f59e0b',         // Yellow
  Other: '#64748b'          // Slate
};

// Toast Notifications
function toast(msg) {
  const t = $('toast');
  let icon = 'fa-circle-info';
  
  // Dynamic icon based on message
  const lowerMsg = msg.toLowerCase();
  if (lowerMsg.includes('delete')) {
    icon = 'fa-trash-can';
  } else if (lowerMsg.includes('save') || lowerMsg.includes('update') || lowerMsg.includes('add')) {
    icon = 'fa-circle-check';
  } else if (lowerMsg.includes('fill') || lowerMsg.includes('fields')) {
    icon = 'fa-circle-exclamation';
  }
  
  t.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
  t.classList.add('show');
  
  // Clear previous timeout if any
  if (t.timeoutId) clearTimeout(t.timeoutId);
  t.timeoutId = setTimeout(() => t.classList.remove('show'), 2500);
}

// Theme Toggler with Icon Swap & Chart Update
$('themeBtn').onclick = () => {
  const isDark = document.body.classList.toggle('dark');
  const icon = $('themeBtn').querySelector('i');
  if (isDark) {
    icon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }
  drawChart();
};

// Check for saved theme preference on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  $('themeBtn').querySelector('i').className = 'fa-solid fa-sun';
}

// Configurable Budget UI Handlers
$('budgetCard').onclick = () => {
  const editGroup = $('budgetEditGroup');
  if (editGroup.style.display === 'none') {
    editGroup.style.display = 'flex';
    $('budgetInput').value = budget;
    $('budgetInput').focus();
  } else {
    editGroup.style.display = 'none';
  }
};

$('budgetSaveBtn').onclick = (e) => {
  e.stopPropagation(); // Avoid triggering parent card click
  const newBudget = +$('budgetInput').value;
  if (!newBudget || newBudget <= 0) {
    toast('Enter a valid budget limit');
    return;
  }
  budget = newBudget;
  localStorage.setItem('budget', budget);
  $('budgetEditGroup').style.display = 'none';
  render();
  toast('Budget limit updated');
};

$('budgetCancelBtn').onclick = (e) => {
  e.stopPropagation(); // Avoid triggering parent card click
  $('budgetEditGroup').style.display = 'none';
};

// Add / Update Expense Handler
$('addBtn').onclick = () => {
  const name = $('name').value.trim();
  const amount = +$('amount').value;
  const category = $('category').value;
  
  if (!name || !amount || !category) {
    toast('Fill all fields correctly');
    return;
  }
  
  const obj = {
    id: editId || Date.now(),
    name,
    amount,
    category,
    date: new Date().toLocaleDateString()
  };
  
  if (editId) {
    expenses = expenses.map(e => e.id === editId ? obj : e);
    toast('Expense updated');
  } else {
    expenses.push(obj);
    toast('Expense added');
  }
  
  editId = null;
  $('addBtn').innerHTML = `<i class="fa-solid fa-plus"></i> Add Expense`;
  save();
  clear();
  render();
};

$('search').oninput = render;
$('filter').onchange = render;

// Export CSV Handler
$('exportBtn').onclick = () => {
  if (expenses.length === 0) {
    toast('No expenses to export');
    return;
  }
  let csv = 'Date,Name,Amount,Category\n';
  expenses.forEach(e => csv += `"${e.date}","${e.name.replace(/"/g, '""')}",${e.amount},"${e.category}"\n`);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = `expenses_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  toast('CSV exported successfully');
};

function save() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function clear() {
  $('name').value = '';
  $('amount').value = '';
  $('category').value = '';
}

// Render UI Components
function render() {
  const q = $('search').value.toLowerCase();
  const f = $('filter').value;
  
  // Filter data
  const data = expenses.filter(e => (f === 'All' || e.category === f) && e.name.toLowerCase().includes(q));
  
  // Render table content with mobile-responsive data labels
  $('list').innerHTML = '';
  let total = 0;
  
  data.forEach(e => {
    total += e.amount;
    const catIcon = CATEGORY_ICONS[e.category] || 'fa-tag';
    
    $('list').innerHTML += `
      <tr>
        <td data-label="Date">${e.date}</td>
        <td data-label="Name">${e.name}</td>
        <td data-label="Category"><span class="table-category"><i class="fa-solid ${catIcon}"></i> ${e.category}</span></td>
        <td data-label="Amount">₹${e.amount.toLocaleString('en-IN')}</td>
        <td data-label="Actions" style="text-align: center;">
          <div class="table-actions" style="justify-content: center;">
            <button class="edit" onclick="editExpense(${e.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="delete" onclick="deleteExpense(${e.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
  });
  
  // Toggle empty state
  $('empty').style.display = data.length ? 'none' : 'block';
  
  // Update Overview figures
  $('total').textContent = '₹' + total.toLocaleString('en-IN');
  $('count').textContent = data.length;
  $('budgetLeft').textContent = '₹' + (budget - total).toLocaleString('en-IN');
  
  // Progress Bar percentage calculations
  const percent = Math.min((total / budget) * 100, 100);
  const progressBar = $('progressBar');
  progressBar.style.width = percent + '%';
  $('progressPercent').textContent = Math.round(percent) + '%';
  
  // Add warnings to progress bar color based on usage
  if (percent >= 90) {
    progressBar.className = 'danger';
  } else if (percent >= 70) {
    progressBar.className = 'warning';
  } else {
    progressBar.className = '';
  }
  
  drawChart();
}

// Edit existing transaction
window.editExpense = id => {
  const e = expenses.find(x => x.id === id);
  if (!e) return;
  
  editId = id;
  $('name').value = e.name;
  $('amount').value = e.amount;
  $('category').value = e.category;
  
  // Update submit button text and scroll into view for small devices
  $('addBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Expense`;
  $('name').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Delete transaction
window.deleteExpense = id => {
  expenses = expenses.filter(e => e.id !== id);
  save();
  render();
  toast('Expense deleted');
};

// Render Distribution Chart
function drawChart() {
  const sums = {};
  
  // Calculate sums for active filter items
  const q = $('search').value.toLowerCase();
  const f = $('filter').value;
  const data = expenses.filter(e => (f === 'All' || e.category === f) && e.name.toLowerCase().includes(q));
  
  data.forEach(e => sums[e.category] = (sums[e.category] || 0) + e.amount);
  
  const ctx = $('chart');
  if (chart) chart.destroy();
  
  const categories = Object.keys(sums);
  const values = Object.values(sums);
  
  if (categories.length === 0) {
    // If no values, render empty chart stub
    ctx.style.display = 'none';
    return;
  }
  ctx.style.display = 'block';
  
  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
  const colors = categories.map(cat => CATEGORY_COLORS[cat] || '#6366f1');
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Spent Amount (₹)',
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(c => c + 'dd'), // slightly transparent hover
        borderRadius: 8,
        borderWidth: 0,
        barThickness: window.innerWidth < 480 ? 18 : 26
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#1e293b',
          bodyColor: isDark ? '#94a3b8' : '#64748b',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          titleFont: { family: 'Poppins', weight: '600' },
          bodyFont: { family: 'Poppins' },
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `₹${context.parsed.y.toLocaleString('en-IN')}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: { family: 'Poppins', size: 11 }
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: { family: 'Poppins', size: 11 },
            callback: function(value) {
              return '₹' + value.toLocaleString('en-IN');
            }
          }
        }
      }
    }
  });
}

// Initial draw
render();
