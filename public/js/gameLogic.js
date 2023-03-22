import Paddle from './Paddle.js';
import Ball from './Ball.js';

export default function gameLogic(creator_room_id,request_id,socket){

const left_paddle=document.getElementById('paddle_a');
const right_paddle=document.getElementById('paddle_b');
const ball_elem=document.getElementById('ball');
const table=document.getElementsByClassName('table')[0];

const a_paddle=new Paddle(left_paddle);
const b_paddle=new Paddle(right_paddle);
const ball=new Ball(ball_elem);

//variable for scorecard
const left_score=document.getElementById('player-a');
const right_score=document.getElementById('player-b');

// paddle control as per room creator or joiner
let my_paddle,opp_paddle;
if(creator_room_id==socket.id)
{
    my_paddle=b_paddle;
    opp_paddle=a_paddle;
}
else
{   
    my_paddle=a_paddle;
    opp_paddle=b_paddle;
}

// opponent paddle movement logic
socket.on("opponent-action-listener",(key)=>{
    let table_height=parseFloat(getComputedStyle(table).getPropertyValue("height"));
    let paddle_half_height=parseFloat(getComputedStyle(right_paddle).getPropertyValue('height'))/2;

    const pos_a=opp_paddle.gety();

    let net_position_value=Math.abs(pos_a)*10+ paddle_half_height;
    if(key=="ArrowUp"){
            if (pos_a>0&& net_position_value>=table_height/2)
            return ;
            opp_paddle.sety(pos_a+1);
        }
        else{
            if (pos_a<0&&(net_position_value>=table_height/2))
            return ;
            opp_paddle.sety(pos_a-1);
        }
    
})


//paddle movement logic 
window.addEventListener('keydown',(e)=>{
    let table_height=parseFloat(getComputedStyle(table).getPropertyValue("height"));
    let paddle_half_height=parseFloat(getComputedStyle(right_paddle).getPropertyValue('height'))/2;

    const pos_a=my_paddle.gety();

    let net_position_value=Math.abs(pos_a)*10+ paddle_half_height;
    switch(e.key){
        case "ArrowUp":{
            if (pos_a>0&& net_position_value>=table_height/2-5)
            return ;
            my_paddle.sety(pos_a+1);
            socket.emit("key-pressed","ArrowUp");
            break;
        }
        case "ArrowDown":{
            if (pos_a<0&&(net_position_value>=table_height/2-5))
            return ;
            my_paddle.sety(pos_a-1);
            socket.emit("key-pressed","ArrowDown");
            break;
        }
    }
});

//game Logic 
let ball_radius=ball.get_ball_radius();
let slope=Math.tan(Math.PI/4);
let x_dir=1;

function ball_trajectory_logic(x,y){

    let table_width=parseFloat(getComputedStyle(table).getPropertyValue("width"));
    let table_height=parseFloat(getComputedStyle(table).getPropertyValue("height"));
   
    let paddle_half_height=parseFloat(getComputedStyle(right_paddle).getPropertyValue('height'))/2;
    let paddle_width=parseFloat(getComputedStyle(right_paddle).getPropertyValue('width'));

    
    let boundary_x=x>0?x+ball_radius:x-ball_radius;
    let boundary_y=y>0?y+ball_radius:y-ball_radius;
    
    //check for collision detection 
    if(parseInt(boundary_x) == parseInt(table_width/2-paddle_width)){
        let paddle_upper_point=b_paddle.gety()*10+paddle_half_height;
        let paddle_lower_point=b_paddle.gety()*10-paddle_half_height;
        if(y<=paddle_upper_point&&y>=paddle_lower_point)
        {
            right_paddle.classList.add("blink");
            setTimeout(() => {
                right_paddle.classList.remove("blink");
            }, 1000);
            x_dir=-1;
        }
    }

    else if(boundary_x>=table_width/2){
            left_score.innerHTML=parseInt(left_score.innerHTML)+1;
            ball.reset()
            socket.emit('left-score',left_score.innerHTML);
            return;
    }

    else if(parseInt(boundary_x)==parseInt(-1*(table_width/2-paddle_width))){
        let paddle_upper_point=a_paddle.gety()*10+paddle_half_height;
        let paddle_lower_point=a_paddle.gety()*10-paddle_half_height;
        if(y<=paddle_upper_point&&y>=paddle_lower_point)
        {
            left_paddle.classList.add("blink");
            setTimeout(()=>{
                left_paddle.classList.remove("blink");
            },1000);
            x_dir=1;
        }
    }
    else if(boundary_x<=-1*(table_width/2)){
            right_score.innerHTML=parseInt(right_score.innerHTML)+1;
            ball.reset();
            socket.emit('right-score',right_score.innerHTML);
            return ;
    }

    else if(boundary_y>=table_height/2){
        slope=slope<0?slope:-1*slope;
    }
    else if(boundary_y<=-1*table_height/2){
            slope=slope>0?slope:-1*slope;
    }

    socket.emit("set-ball-track",x+x_dir,y+slope);
    ball.set_Cordinates([x+x_dir,y+slope]);
}

// joinee socket loigc
socket.on("get-ball-track",(x,y)=>{
    ball.set_Cordinates([x,y]);
});

socket.on('set-left-score',(val)=>{
    left_score.innerHTML=val;
})

socket.on('set-right-score',(val)=>{
    right_score.innerHTML=val;
})

// ball animation set Interval
  if(socket.id==creator_room_id){
    let setter=setInterval(()=>{
        let [x,y]=ball.get_Cordinates();
            ball_trajectory_logic(x,y);
    },5);

    setTimeout(()=>{
        clearInterval(setter);
        setter=setInterval(()=>{
            let [x,y]=ball.get_Cordinates();
                ball_trajectory_logic(x,y);
        },3);
    },20000);

    setTimeout(()=>{
        clearInterval(setter);
        setter=setInterval(()=>{
            let [x,y]=ball.get_Cordinates();
                ball_trajectory_logic(x,y);
        },1);
    },20000);


    }

}