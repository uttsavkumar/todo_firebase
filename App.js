import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Button } from 'react-native';
import { useState,useEffect } from 'react';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Checkbox } from 'react-native-paper';


import React from 'react';


const App = () => {
  const [list, setList] = useState([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState(false)
  const [searchinput, setSearchInput] = useState('')

  const ref = database().ref('/todolist')
//calling data
  useEffect(() => {
     ref.on('value' ,function (snapshot){
      let data = []
      snapshot.forEach((childSnapshot) => {
        let singleData = childSnapshot.val()
        singleData['key'] = childSnapshot.key
        data = [...data,singleData]
      })
      setList(data)
     } )
  }, [])

//adding data
  const handleAdd = () => {

    ref.push().set({
      id: 3,
      title: input,
      status:false
    }).then(() => {
      setInput('')
    })
  }
  //deleteing data
  const handleDel = (id) => {
     database().ref(`todolist/${id}`).remove()
  }
  //updating data 
  const handleCheck = (id) => {
    database().ref(`todolist/${id}`).once('value').then((snapshot) => {
      database().ref(`todolist/${id}`).update({
        status:!snapshot.val().status
      })
    
    })
  }
  //searching data
  const handleEvent = () => {
    setSearch(true)
    const searchdata = ref.orderByChild('title').equalTo(searchinput)
    console.log(searchdata)
  }
  
  return (
    <>
      <View style={style.main}>
        <View style={style.header}>
          <Text style={style.date}>Friday, May 11</Text>
          <View style={style.titleSection}>
            {
              search === false
                ?
                <>
                  <Text style={style.titleText}>To-Do List</Text>
                  <View style={{ alignSelf: 'center', marginTop: 4 }}>
                    <Pressable onPress={() => handleEvent()}>
                      <Icon size={22} color="grey" name="search" />
                    </Pressable>
                  </View>
                </>
                :
                <>
                  <TextInput placeholderTextColor={"grey"} style={style.search} onChangeText={(text) => setSearchInput(text)} placeholder="Search a Task"></TextInput>
                  <View style={{ alignSelf: 'center', marginTop: 5 }}><Icon name="arrow-circle-right" size={23} color="grey" onPress={() => setSearch(false)} /></View>
                </>
            }
          </View>
        </View>

        <ScrollView style={{ borderTopWidth: .2, borderTopColor: '#4a4a4a' }}>
          <View style={style.content}>
            {
              list.map((value, key) => (
                <View style={style.todobox} key={key}>
                  <Icon name="dot-circle" size={13} color="black" style={{textAlignVertical:'top',marginLeft:3,marginTop:4}}/>
                  {value.status === true ?
                    <Text style={style.contentTextFalse}> {value.title}</Text>
                    :
                    <Text style={style.contentText}> {value.title}</Text>
                  }
                  <Pressable onPress={() => handleDel(value.key)} style={{ marginTop: 8 }}>
                    <Icon size={18} color="red" name="trash" />

                  </Pressable>
                  <Pressable onPress={() => handleCheck(value.key)}>
                    <Checkbox style={style.checkbox} status={value.status === true ? "checked" : 'unchecked'} />
                  </Pressable>
                </View>

              ))
            }

          </View>
        </ScrollView>


        <View style={{ position: 'relative' }}>
          <View style={style.footer}>
            <TextInput placeholderTextColor={"grey"} style={style.input} placeholder="Enter a Task" value={input} onChangeText={(text) => setInput(text)}></TextInput>
            <Pressable style={style.btn} onPress={() => handleAdd()}>
              <Text style={style.add}>
                <Icon size={18} color="black" name="plus" />
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

    </>
  )
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ebebeb'
  },
  header: {
    marginTop: 70,
    marginLeft: 25,
    marginBottom: 20,
  },
  icon: {
    fontWeight: '700',

  },
  titleSection: {
    flexDirection: 'row',
  },
  date: {
    color: '#4a4a4a',
    paddingBottom: 5,
    marginLeft: 5

  },
  titleText: {
    fontWeight: '800',
    fontSize: 30,
    flexGrow: .9,
    color: 'black',
    fontFamily: 'sans-serif'
  },
  content: {
    display: 'flex',
    padding: 20,
    flexDirection: 'column',

  },
  todobox: {
    width: 320,
    maxHeight: 'auto',
    marginTop: 15,
    padding: 6,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  contentText: {
    color: '#2e2d2d',
    fontFamily: '',
    fontWeight: '400',
    marginLeft: 5,
    marginTop: 2,
    flex: 1,

  },
  contentTextFalse: {
    color: 'grey',
    fontFamily: '',
    fontWeight: '400',
    marginLeft: 5,
    marginTop: 2,
    flex: 1,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },

  checkbox: {
    height: 10,
    borderRadius: 10,
    borderWidth: .2,
    borderColor: 'white'
  },
  footer: {
    backgroundColor: 'transparent',
    height: 90,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',

  },
  input: {
    width: 220,
    height: 50,
    borderWidth: .5,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    color: 'black'
  },
  search: {
    width: 290,
    height: 40,
    marginTop: 5,
    borderWidth: .5,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingLeft: 15,
    marginRight: 5,
    color:'black'
  },
  btn: {
    width: 60,
    marginLeft: 25,
    marginTop: -4,
    borderRadius: 60,
    borderColor: 'grey',
    borderWidth: .4,
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center',
    textAlignVertical: 'middle'
  },
  add: {
    marginTop: 18,
    fontWeight: 'bold',
    fontSize: 24
  }
})
export default App;