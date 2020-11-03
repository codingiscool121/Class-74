import React from 'react';
import { Text, View, FlatList } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import db from  '../config'
export default class Searchscreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      allTransactions:[],
      lastrecord:null,
    }
  }

  componentDidMount=async()=>{
   const getdata = await db.collection("Transaction").limit(5).get();
   getdata.docs.map(doc=>{
     this.setState({
       //Three dots because it is putting the data from the two places together.
       allTransactions:[...this.state.allTransactions,doc.data()]
     })
   })
  }
  fetchRecord=async()=>{
    //will start after last record
    const query = await db.collection("Transaction").where('bookId','==',"b001").startAfter(this.state.lastrecord).limit(10).get()
    query.docs.map(doc=>{
      this.setState({
        //Three dots because it is putting the data from the two places together.
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastrecord:doc,
      })
    })
  }
    render() {
      console.log(this.state.allTransactions)
      return (
        //Transaction refers to the document. Index refers to index record. This brings the Transaction record and transaction record number together.
      <FlatList
      data={
        this.state.allTransactions
      }
      renderItem={
        ({item})=>{
          <View>
          <Text>
            {"BookId:"+item.bookId}
          </Text>
          <Text>
            {"StudentId:"+item.studentId}
          </Text>
          <Text>
            {"TransactionType:"+item.TransactionType};
          </Text>
          <Text>
            {"Date:"+item.date.toDate()};
          </Text>
        </View>
        }
      }
      keyExtractor={
        (item,index)=>{
         return index.toString();
        }
      }
        onEndReached={
          this.fetchRecord()
        }
        //0.7=When completed 70%, it will go back and fetch the record.
      onEndReachedThreshold={0.7}
        />
      );
    }
  }