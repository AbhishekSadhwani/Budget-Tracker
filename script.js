
// creating the transaction object if not there otherwise getting the value frm localStorage
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

// fetching incomeList expenseList and addTransaction form
const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const addTransactionForm = document.querySelector(".add-form");

// function to show all transaction in storage on page when we load the it
function getTransactions(){
    transactions.forEach(transaction => {
        addTransactionDOM(
                            transaction.id,
                            transaction.source,
                            transaction.amount,
                            transaction.time
                        );
    });
}
getTransactions();

/*
function to update the statistics of the page when the page is loaded it will fetch all the transactions
from the local storage and calculate the expense, income and balance
*/
function updateStats(){
    let income = transactions.
                filter(transaction => transaction.amount >=0).
                reduce((total,transaction) => Number(transaction.amount) + total, 0);

    let expense = transactions.
                filter(transaction => transaction.amount < 0).
                reduce((total,transaction) => Math.abs(Number(transaction.amount)) + total, 0);


    document.querySelector("#balance").textContent = income-expense;
    document.querySelector("#income").textContent = income;
    document.querySelector("#expense").textContent = expense;

};
updateStats();

// function to generate the template to add income or expense
function generateTemplate(id,source,amount,time){
    return `<li id="${id}">
                <p>
                    <span>${source}</span>
                    <span class="time">${time}</span>
                </p>
                <span>$${Math.abs(amount)}</span>
                <i class="bi bi-trash-fill delete"></i>
            </li>`; 
};


/* function to add income or expense to html page with all the values passed as arguments 
and uses the generateTemplate function to generate the template directly and add it in DOM
*/
function addTransactionDOM(id,source,amount,time){
    if(amount >=0){
        incomeList.innerHTML += generateTemplate(id,source,amount,time);
    }
    else{
        expenseList.innerHTML += generateTemplate(id,source,amount,time);
    }
};

// function to add the transactuions to localStorage and then passing all the values addTransactionDOM function
function addTransaction(source,amount){
    let date = new Date();
    let currTime = date.toLocaleTimeString() +" " + date.toLocaleDateString();
    let transactionId = Math.round(Math.random()*1000);
    data = {
        id:transactionId,
        source:source,
        amount:amount,
        time:currTime 
       };
    
    transactions.push(data);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    addTransactionDOM(transactionId,source,amount,currTime);
};


addTransactionForm.addEventListener("submit", (Event) => {
    Event.preventDefault();
    if(addTransactionForm.source.value == "" || addTransactionForm.amount.value == ""){
        alert("Please Provide the Source and Amount to add a transaction.");
    }
    else{
        addTransaction(addTransactionForm.source.value,addTransactionForm.amount.value);
        addTransactionForm.reset();
        updateStats();
    }
});

// function to remove the particular record from trasaction based on id
function deleteTransaction(id){
    transactions = transactions.filter(transaction => {
                                        return transaction.id !== Number(id);
                                    });
    
    localStorage.setItem("transactions",JSON.stringify(transactions));
};


// deleting an income record
incomeList.addEventListener("click", (Event) =>{
    if(Event.target.classList.contains("delete")){
        deleteTransaction(Event.target.parentElement.id);
        Event.target.parentElement.remove();
        updateStats();

    }
});


// deleting an expense record
expenseList.addEventListener("click", (Event) =>{
    if(Event.target.classList.contains("delete")){
        deleteTransaction(Event.target.parentElement.id);
        console.log(Event.target.parentElement.id);
        Event.target.parentElement.remove();
        updateStats();
    }
});
