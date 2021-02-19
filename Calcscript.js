
function depCalculate() {
  let depSumInitial = document.getElementById("dep-sum-initial").value;
  let depRate = document.getElementById("dep-rate").value / 100;
  let depPeriodMonth = document.getElementById("dep-period-month").value;
  
  let depStartDate = new Date(document.getElementById("dep-start-date").value);
  let depEndDate = new Date(document.getElementById("dep-start-date").value);
  depEndDate = depEndDate.setMonth(depEndDate.getMonth() + +document.getElementById("dep-period-month").value);
    
  let depPeriodDays = (depEndDate - depStartDate) / (1000 * 60 * 60 * 24);
  
  let capitalized = document.getElementById("capitalized").checked;
  let depSumCalculated = 0;
  
  if (capitalized) {
    depSumCalculated = (depSumInitial * (1 + depRate/12) ** depPeriodMonth).toFixed(2);
  } else {
    depSumCalculated = (depSumInitial * (1 + depRate / 365 * depPeriodDays)).toFixed(2);
  }
  let depRateEffective = (((depSumCalculated - depSumInitial) / depPeriodDays * 365) / depSumInitial * 100).toFixed(2) + "%";
  
  document.getElementById("dep-sum-calculated").innerHTML = (+depSumCalculated).toLocaleString(undefined, {minimumFractionDigits: 2});
  document.getElementById("dep-rate-effective").innerHTML = depRateEffective;
}


function loanCalculate() {
  let loanSumInitial = document.getElementById("loan-sum-initial").value;
  let loanRate = document.getElementById("loan-rate").value / 100;
  let loanStartDate = new Date(document.getElementById("loan-start-date").value);
  
  let loanPeriodType = document.getElementById("loan-period-type").value;
  let loanPeriodValue = document.getElementById("loan-period-value").value;
  let loanPaymentType = document.getElementById("loan-payment-type").value;

  let loanPeriodMonths = 0;
  let outputPayment = 0;
  let outputTotalPayments = 0;
  let loanOverPayment = 0;
  let loanRateEffective = 0;

  let loanPaymentsArr = [];
  let loanDebtPaymentsArr = [];
  let loanIntPaymentsArr = [];
  
  // convert years into months
  if (loanPeriodType === "year") {
    loanPeriodMonths = loanPeriodValue * 12;
  } else {
    loanPeriodMonths = loanPeriodValue;
  }
  
 
  // draw Loan payments Table
  
  // get reference for the table-field
  let tableField = document.getElementById("loan-payments-table");

  // create a <table> and it's inner elements <thead>, <tbody> and <tfoot>
  let table = document.createElement("table");
  let tableBody = document.createElement("tbody");
  //let tableHead = document.createElement("thead");
  // creating cells
  
  let tableHeadTitlesEng = [
    "#",
    "<span class='english'>Date</span><span class='russian except' style='display: none;'>Дата</span>",
    "<span class='english'>Days</span><span class='russian except' style='display: none;'>Дни</span>",
    "<span class='english'>The amount of payment</span><span class='russian except' style='display: none;'>Платеж</span>",
    "<span class='english'>Principal debt</span><span class='russian except' style='display: none;'>Погашение основного долга</span>",
    "<span class='english'>Sum of interest</span><span class='russian except' style='display: none;'>Выплата процентов</span>",
    "<span class='english'>Balance of principal</span><span class='russian except' style='display: none;'>Остаток основного долга</span>"
  ];
  let tableHeadTitlesRu = [
    "#",
    "<span class='english' style='display: none;'>Date</span><span class='russian except'>Дата</span>",
    "<span class='english' style='display: none;'>Days</span><span class='russian except'>Дни</span>",
    "<span class='english' style='display: none;'>The amount of payment</span><span class='russian except'>Платеж</span>",
    "<span class='english' style='display: none;'>Principal debt</span><span class='russian except'>Погашение основного долга</span>",
    "<span class='english' style='display: none;'>Sum of interest</span><span class='russian except'>Выплата процентов</span>",
    "<span class='english' style='display: none;'>Balance of principal</span><span class='russian except'>Остаток основного долга</span>"
  ];
  for (let i = 0; i <= +loanPeriodMonths + 1; i++) {
    let row = document.createElement("tr");
    for (let j = 1; j <= tableHeadTitlesEng.length; j++) {
      let cell = document.createElement("td");
      // let cellText = document.createTextNode(i+" - "+j);
      // cell.append(cellText);
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
  
  table.appendChild(tableBody);

    // insert head Title
  let checkboxEng = document.querySelector("#eng-label");

  if (checkboxEng.checked == true) {
    for (let i = 0; i < tableHeadTitlesEng.length; i++) {
      table.rows[0].cells.item(i).innerHTML = tableHeadTitlesEng[i];
    }
  } else {
    for (let i = 0; i < tableHeadTitlesEng.length; i++) {
      table.rows[0].cells.item(i).innerHTML = tableHeadTitlesRu[i];
    }
  }

    // insert 1 column <#> data
  for (let i = 1; i <= loanPeriodMonths; i++) {
    table.rows[i].cells.item(0).innerHTML = i;
  }
    // insert Second column <Date>
  let lastDayMonthBefore = function(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    return new Date(year, month, 0);
  }

  // array of dates and days for table
  let datesArray = [loanStartDate.toLocaleDateString()];
  let daysArray = [];
    
  // create a date column with step = +1 month
  for (let i = 1; i <= loanPeriodMonths; i++) {
    let nextDateCheck = new Date(document.getElementById("loan-start-date").value);  // get Begin date from DOM
    let nextDateTime = new Date(nextDateCheck);  // make a copy of the Begin date
    nextDateTime = nextDateTime.setMonth(nextDateTime.getMonth() + i);  // return next month with the same day of the month
    let nextDate = new Date(nextDateTime);  // convert into Millisec format

    if ((nextDate.getMonth() - (i % 12)) > nextDateCheck.getMonth()) {
      table.rows[i].cells.item(1).innerHTML = lastDayMonthBefore(nextDate).toLocaleDateString('ru-Ru'); // add DATE to table
      datesArray.push(lastDayMonthBefore(nextDate).toLocaleString());     // add DATE to <Date array>
    } else {
      table.rows[i].cells.item(1).innerHTML = nextDate.toLocaleDateString('ru-Ru');
      datesArray.push(nextDate.toLocaleString());
    }

    // add "Total" text
    
    if (i == loanPeriodMonths) {
      if (checkboxEng.checked == true) {
        table.rows[i+1].cells.item(1).innerHTML = "<span class='english'>Total:</span><span class='russian except' style='display: none;'>Итого:</span>"
      } else {
        table.rows[i+1].cells.item(1).innerHTML = "<span class='english' style='display: none;'>Total:</span><span class='russian except'>Итого:</span>"
      }
    }

    // add days amount to <Days array> and DOM table
    daysArray.push(Math.round((Date.parse(datesArray[i]) - Date.parse(datesArray[i-1])) / (1000*60*60*24)));
    table.rows[i].cells.item(2).innerHTML = daysArray[i-1];
  }


  let annuity = (loanSumInitial * (loanRate/12 *((1 + loanRate/12)**loanPeriodMonths)) / ((1 + loanRate/12)**loanPeriodMonths - 1)).toFixed(2);
    
  let debtLeft = loanSumInitial;
  
  if (loanPaymentType === "annuity") {
  
    for (let i = 0; i < loanPeriodMonths; i++) {
      loanIntPaymentsArr.push((debtLeft * (loanRate / 365 * daysArray[i])).toFixed(2)); // calculate Interest payment for every period
      
      if (i + 1 == loanPeriodMonths) {
        loanDebtPaymentsArr.push((+debtLeft).toFixed(2)); // if it's last payment take the amount of DebtPayment form DebtLeft
        loanPaymentsArr.push((+loanDebtPaymentsArr[i] + +loanIntPaymentsArr[i]).toFixed(2));
        table.rows[i+1].cells.item(4).innerHTML = (+debtLeft).toLocaleString(undefined, {minimumFractionDigits: 2});  
        table.rows[i+1].cells.item(3).innerHTML = ((+loanDebtPaymentsArr[i]) + (+loanIntPaymentsArr[i])).toLocaleString(undefined, {minimumFractionDigits: 2});
      } else {
        loanPaymentsArr.push(annuity);
        loanDebtPaymentsArr.push((annuity - loanIntPaymentsArr[i]).toFixed(2));
        table.rows[i+1].cells.item(3).innerHTML = (+annuity).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+1].cells.item(4).innerHTML = (+loanDebtPaymentsArr[i]).toLocaleString(undefined, {minimumFractionDigits: 2});
      }
    
      debtLeft = (debtLeft - loanDebtPaymentsArr[i]).toFixed(2);
      
      table.rows[i+1].cells.item(5).innerHTML = (+loanIntPaymentsArr[i]).toLocaleString(undefined, {minimumFractionDigits: 2});
      table.rows[i+1].cells.item(6).innerHTML = (+debtLeft).toLocaleString(undefined, {minimumFractionDigits: 2});
    
      if (i + 1 == loanPeriodMonths) {
        table.rows[i+2].cells.item(3).innerHTML = (loanPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+2].cells.item(4).innerHTML = (loanDebtPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+2].cells.item(5).innerHTML = (loanIntPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
      }    
    }
  } else {
    for (let i = 0; i < loanPeriodMonths; i++) {
      loanIntPaymentsArr.push((debtLeft * (loanRate / 365 * daysArray[i])).toFixed(2));
      
      if (i + 1 == loanPeriodMonths) {
        loanDebtPaymentsArr.push((+debtLeft).toFixed(2));
        loanPaymentsArr.push((+loanDebtPaymentsArr[i] + +loanIntPaymentsArr[i]).toFixed(2)); // add to array payment = Debt + Interest payments
        table.rows[i+1].cells.item(4).innerHTML = (+debtLeft).toLocaleString(undefined, {minimumFractionDigits: 2}); // add to table the last Debt payment 
        // add to table the last Payment = Debt + Interest
        table.rows[i+1].cells.item(3).innerHTML = ((+loanDebtPaymentsArr[i]) + (+loanIntPaymentsArr[i])).toLocaleString(undefined, {minimumFractionDigits: 2});
      } else {
        loanDebtPaymentsArr.push((+loanSumInitial / +loanPeriodMonths).toFixed(2));
        loanPaymentsArr.push(+loanIntPaymentsArr[i] + +loanDebtPaymentsArr[i]);
        table.rows[i+1].cells.item(3).innerHTML = (+loanPaymentsArr[i]).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+1].cells.item(4).innerHTML = (+loanDebtPaymentsArr[i]).toLocaleString(undefined, {minimumFractionDigits: 2});
      }

      debtLeft = (debtLeft - loanDebtPaymentsArr[i]).toFixed(2);
      
      table.rows[i+1].cells.item(5).innerHTML = (+loanIntPaymentsArr[i]).toLocaleString(undefined, {minimumFractionDigits: 2});
      table.rows[i+1].cells.item(6).innerHTML = (+debtLeft).toLocaleString(undefined, {minimumFractionDigits: 2});
    
      if (i + 1 == loanPeriodMonths) {
        table.rows[i+2].cells.item(3).innerHTML = (loanPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+2].cells.item(4).innerHTML = (loanDebtPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
        table.rows[i+2].cells.item(5).innerHTML = (loanIntPaymentsArr.reduce((a,b)=> +a + +b)).toLocaleString(undefined, {minimumFractionDigits: 2});
      }
    }
  }

  // hide "Day" column
  for (let i = 0; i < +loanPeriodMonths + 2; i++) {
    table.rows[i].cells.item(2).style.display = "none";
  }

   // calculate Output
  if (loanPaymentType === "annuity") {
    outputPayment = (+annuity).toLocaleString(undefined, {minimumFractionDigits: 2});
    outputTotalPayments = loanPaymentsArr.reduce((a,b)=> +a + +b);
    loanOverPayment = outputTotalPayments - loanSumInitial;
  } else {
    outputPayment = Math.min(...loanPaymentsArr).toLocaleString(undefined, {minimumFractionDigits: 2}) +
       " ... " + Math.max(...loanPaymentsArr).toLocaleString(undefined, {minimumFractionDigits: 2});
    outputTotalPayments = loanPaymentsArr.reduce((a,b)=> +a + +b);
    loanOverPayment = outputTotalPayments - loanSumInitial;
  }

  tableField.innerHTML = "";  // clear table field
  tableField.appendChild(table);  // append table to DOM
  
  document.getElementById("loan-month-payment").innerHTML = outputPayment;
  document.getElementById("loan-total-payments").innerHTML = (+outputTotalPayments).toLocaleString(undefined, {minimumFractionDigits: 2});
  document.getElementById("loan-overpayment").innerHTML = (+loanOverPayment).toLocaleString(undefined, {minimumFractionDigits: 2});

}


function checkLanguage() {
  let checkboxEng = document.querySelector("#eng-label");
  let toggleEng = document.querySelectorAll(".english");
  let toggleRus = document.querySelectorAll(".russian");
  if (checkboxEng.checked == true) {
    for (let i = 0; i < toggleEng.length; i++) {
      toggleEng[i].style.display = "inline-block";
    }
    for (let i = 0; i < toggleRus.length; i++) {
      toggleRus[i].style.display = "none";
    }
  } else {
    for (let i = 0; i < toggleEng.length; i++) {
      toggleEng[i].style.display = "none";
    }
    for (let i = 0; i < toggleRus.length; i++) {
      toggleRus[i].style.display = "inline-block";
    }
  }
}










