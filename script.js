const BUDGET=20000;
let expenses=JSON.parse(localStorage.getItem('expenses')||'[]');
let chart,editId=null;

const $=id=>document.getElementById(id);
$('today').textContent=new Date().toDateString();

function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}

$('themeBtn').onclick=()=>document.body.classList.toggle('dark');

$('addBtn').onclick=()=>{
 const name=$('name').value.trim();
 const amount=+$('amount').value;
 const category=$('category').value;
 if(!name||!amount||!category){toast('Fill all fields');return;}
 const obj={id:editId||Date.now(),name,amount,category,date:new Date().toLocaleDateString()};
 if(editId) expenses=expenses.map(e=>e.id===editId?obj:e); else expenses.push(obj);
 editId=null;
 save(); clear(); render(); toast('Saved');
};

$('search').oninput=render;
$('filter').onchange=render;

$('exportBtn').onclick=()=>{
 let csv='Date,Name,Amount,Category\n';
 expenses.forEach(e=>csv+=`${e.date},${e.name},${e.amount},${e.category}\n`);
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv]));
 a.download='expenses.csv'; a.click();
};

function save(){localStorage.setItem('expenses',JSON.stringify(expenses));}
function clear(){$('name').value='';$('amount').value='';$('category').value='';}

function render(){
 const q=$('search').value.toLowerCase();
 const f=$('filter').value;
 const data=expenses.filter(e=>(f==='All'||e.category===f)&&e.name.toLowerCase().includes(q));
 $('list').innerHTML='';
 let total=0;
 data.forEach(e=>{
 total+=e.amount;
 $('list').innerHTML+=`<tr><td>${e.date}</td><td>${e.name}</td><td>₹${e.amount}</td><td>${e.category}</td><td><button class="edit" onclick="editExpense(${e.id})">Edit</button> <button class="delete" onclick="deleteExpense(${e.id})">Delete</button></td></tr>`;
 });
 $('empty').style.display=data.length?'none':'block';
 $('total').textContent='₹'+total;
 $('count').textContent=data.length;
 $('budgetLeft').textContent='₹'+(BUDGET-total);
 $('progressBar').style.width=Math.min((total/BUDGET)*100,100)+'%';
 drawChart();
}

window.editExpense=id=>{
 const e=expenses.find(x=>x.id===id);
 editId=id;
 $('name').value=e.name;$('amount').value=e.amount;$('category').value=e.category;
};

window.deleteExpense=id=>{
 expenses=expenses.filter(e=>e.id!==id);
 save(); render(); toast('Deleted');
};

function drawChart(){
 const sums={};
 expenses.forEach(e=>sums[e.category]=(sums[e.category]||0)+e.amount);
 const ctx=$('chart');
 if(chart) chart.destroy();
 chart=new Chart(ctx,{type:'bar',data:{labels:Object.keys(sums),datasets:[{label:'Expenses',data:Object.values(sums)}]}});
}
render();
