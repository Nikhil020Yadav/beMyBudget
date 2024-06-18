import React,{useEffect, useState} from 'react'
import Header from '../components/Header';
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import NoTransactions from '../components/NoTransactions';

import { toast } from 'react-toastify';
import { addDoc,collection,query,getDocs, Transaction } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';

function Dashboard() {
  const [transaction,setTransactions]=useState([]);
  const [loading,setLoading]=useState(false);
  const [user]=useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible]=useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible]=useState(false);
  const [income,setIncome]=useState(0);
  const [expense,setExpense]=useState(0);
  const [totalBalance,setTotalBalance]=useState(0);

  const showExpenseModal=()=>{
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal=()=>{
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel=()=>{
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel=()=>{
    setIsIncomeModalVisible(false);
  };

  const onFinish=(values,type)=>{
    const newTransaction={
      type:type,
      date:values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    }
    addTransaction(newTransaction);
  }

  async function addTransaction(trans,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        trans
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added");
      let newArr=transaction;
      newArr.push(trans);
      setTransactions(newArr);
      calculateBalance();
    } 
    catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }

  useEffect(()=>{
    //get all docs from a collection
    fetchTransactions();
  },[user]);

  useEffect(()=>{
      calculateBalance();
  },[transaction]);

  function calculateBalance(){
    let incomeTotal = 0;
    let expensesTotal = 0;

    transaction.forEach((trans) => {
      if (trans.type === "income") {
        incomeTotal += trans.amount;
      } else {
        expensesTotal += trans.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    
    setLoading(false);
  }

  let sortedTransactions=transaction.sort((a,b)=>{
    return new Date(a.date) - new Date(b.date);
  })
  return (
    <div>
      <Header/>

      {loading?<p>Loading...</p>:<>
      <Cards
      income={income}
      expense={expense} 
      totalBalance={totalBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
      
      
      />
      {transaction.length!=0 ? <ChartComponent sortedTransactions={sortedTransactions} /> : <NoTransactions/>}
      
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable transaction={transaction} addTransaction={addTransaction}
      fetchTransactions={fetchTransactions} />
      </>}
    </div>
  )
}

export default Dashboard;