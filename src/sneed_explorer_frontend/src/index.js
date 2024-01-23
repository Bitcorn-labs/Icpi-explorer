import { sneed_explorer_backend } from "../../declarations/sneed_explorer_backend";

function toJsonString(o) {
  return JSON.stringify(o, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
  );
}

//document.querySelector("form").addEventListener("submit", async (e) => {
//  e.preventDefault();

async function fetchInfo() { return fetchInfoI(); }

async function openDashboard() { 

  document.getElementById("dashboard").style["visibility"] = "visible";
  document.getElementById("account").style["visibility"] = "hidden";
  document.getElementById("transaction").style["visibility"] = "hidden";

}

async function fetchTransactions() { 
  var txs_i = document.getElementById("find_txs_id").value;

  var txs_response = await sneed_explorer_backend.get_transactions(txs_i, 10);
  alert(txs_response);
}



async function fetchTransactionInfo() { 
  var tx_i = document.getElementById("find_tx_id").value;
  fetchInfoI(null, tx_i)
}

async function fetchAccountInfo() { 
  var acct_i = document.getElementById("find_account_id").value;
  fetchInfoI(acct_i)
}

async function fetchInfoI(acct_i, tx_i) {
  let decimals = 12;
  let decimals_div = Number(1000000000000);
  const urlParams = new URLSearchParams(window.location.search);
  const acct_id = acct_i ?? urlParams.get('acct');
  const tx_id = tx_i ?? urlParams.get('tx');

  var spinner = "<img src='loading-gif.gif' height='16' width='16' />";
  //var failed = "<img src='loading-gif.gif' height='24' width='24' />";
  var failed = "FAILED";

  if (acct_id) {

    document.getElementById("dashboard").style["visibility"] = "hidden";
    document.getElementById("account").style["visibility"] = "visible";
    document.getElementById("transaction").style["visibility"] = "hidden";

    //document.getElementById("account_id").innerText = acct_id;
    document.getElementById("account_id").innerHTML = spinner;
    document.getElementById("account_balance").innerHTML = spinner;

    var acct_response = await sneed_explorer_backend.balance_of(acct_id);
    if (acct_response) {

      var acct_balance = Number(acct_response);  
      var acct_balance_div = acct_balance / decimals_div;
      document.getElementById("account_id").innerHTML = acct_id;
      document.getElementById("account_balance").innerHTML = acct_balance_div + " SNEED";

    } else {

      document.getElementById("account_id").innerHTML = failed;
      document.getElementById("account_balance").innerHTML = acct_balance_div + failed;
  
    }
  
  } else if (tx_id) {

    document.getElementById("dashboard").style["visibility"] = "hidden";
    document.getElementById("account").style["visibility"] = "hidden";
    document.getElementById("transaction").style["visibility"] = "visible";

    document.getElementById("tx_id").innerHTML = spinner;
    document.getElementById("tx_kind").innerHTML = spinner;
    document.getElementById("tx_status").innerHTML = spinner;
    document.getElementById("tx_timestamp").innerHTML = spinner;
    document.getElementById("tx_amount").innerHTML = spinner;
    document.getElementById("tx_fee").innerHTML = spinner;
    document.getElementById("tx_memo").innerHTML = spinner ?? "";

    document.getElementById("tx_from_account").innerHTML = spinner;
    document.getElementById("tx_to_account").innerHTML = spinner;

    document.getElementById("prev").href = 'https://suemn-5aaaa-aaaap-qb62q-cai.icp0.io/?tx=' + (parseInt(tx_id) - 1);
    document.getElementById("next").href = 'https://suemn-5aaaa-aaaap-qb62q-cai.icp0.io/?tx=' + (parseInt(tx_id) + 1);

    var tx_response = await sneed_explorer_backend.get_transaction(parseInt(tx_id));  

    if (tx_response) {

      var tx_info = tx_response[0];
      var tx_kind = tx_info.kind;
      var tx_timestamp = tx_info.timestamp;
      var tx_index = tx_info.index;
      var tx_memo = tx_info.memo;
      
      var transfer = tx_info.transfer[0];
      var tx_from_account = transfer.from.owner;
      var tx_to_account = transfer.to.owner;
      var tx_fee = transfer.to.fee ?? 0.0001;
  
      var tx_amount = Number(transfer.amount);
      var tx_amount_div = tx_amount / decimals_div;

      var time_div = Number(1000000);

      var tx_time = Number(tx_timestamp) / time_div;
  
      document.getElementById("tx_id").innerHTML = tx_index;
      document.getElementById("tx_kind").innerHTML = tx_kind;
      document.getElementById("tx_status").innerHTML = "Completed";
      document.getElementById("tx_timestamp").innerHTML = new Date(tx_time);
      document.getElementById("tx_amount").innerHTML = tx_amount_div + " Bitcorn";
      document.getElementById("tx_fee").innerHTML = tx_fee + " Bitcorn";
      document.getElementById("tx_memo").innerHTML = tx_memo ?? "";
  
      document.getElementById("tx_from_account").innerHTML = '<a href="https://suemn-5aaaa-aaaap-qb62q-cai.icp0.io/?acct=' + tx_from_account + '">' + tx_from_account + '</a>';
      document.getElementById("tx_to_account").innerHTML = '<a href="https://suemn-5aaaa-aaaap-qb62q-cai.icp0.io/?acct=' + tx_to_account + '">' + tx_to_account + '</a>';
  
    } else {

      document.getElementById("tx_id").innerHTML = failed;
      document.getElementById("tx_kind").innerHTML = failed;
      document.getElementById("tx_status").innerHTML = failed;
      document.getElementById("tx_timestamp").innerHTML = failed;
      document.getElementById("tx_amount").innerHTML = failed;
      document.getElementById("tx_fee").innerHTML = failed;
      document.getElementById("tx_memo").innerHTML = failed ?? "";
  
      document.getElementById("tx_from_account").innerHTML = failed;
      document.getElementById("tx_to_account").innerHTML = failed;
  
    }
  }
  return false;
}

document.getElementById("topbar").addEventListener("click", async (e) => {    
  e.preventDefault();    
  await openDashboard();  
  return false;
});

document.getElementById("find_account").addEventListener("click", async (e) => {    
  e.preventDefault();    
  await fetchAccountInfo();  
  return false;
});

document.getElementById("find_tx").addEventListener("click", async (e) => {    
  e.preventDefault();    
  await fetchTransactionInfo();  
  return false;
});

document.getElementById("find_txs").addEventListener("click", async (e) => {    
  e.preventDefault();    
  await fetchTransactions();  
  return false;
});

await fetchInfo();
//});
