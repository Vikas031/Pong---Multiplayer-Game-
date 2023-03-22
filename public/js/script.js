let socket=io();
import gameLogic from './gameLogic.js';

const create_room_btn=document.getElementById('create_room_btn');
const join_room_btn=document.getElementById('join_room_btn');
const name=document.getElementById('name');

create_room_btn.addEventListener("click",()=>{
    if(name.value==""){
        window.alert("Please add name first !")
        return ;
    }
    document.getElementById("room_id").innerHTML=socket.id;
    socket.emit('create-room',socket.id,name.value);
})

join_room_btn.addEventListener("click",()=>{
    if(name.value==""){
        window.alert("Please add name first !")
        return ;
    }

    let creator_room_id=document.getElementById("joining_room_id").value;//from inbox
    if(creator_room_id===socket.id){
            window.alert("KARLI NA BADMASHI !");
            return ;
    }
    socket.emit("start-game","Let's start",creator_room_id,socket.id,name.value);
});

socket.on("receive-ids",(creator_room_id,request_id,creator_name,joinee_name) =>{

    document.getElementById("intro_board").style.display="none";
    document.getElementsByClassName("playground")[0].style.display="block";
    
    //add score-card player_names 
    const name=document.getElementById('name');
    document.getElementById('left_player_name').innerText=joinee_name;
    document.getElementById('right_player_name').innerText=creator_name;
    
    gameLogic(creator_room_id,request_id,socket,creator_name,joinee_name);
})











