export default class Ball{
    constructor(ballElem){
        this.ballElem=ballElem;
    }

    get_Cordinates(){
        let x= parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
        let y=parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
        return [x,y];
    }

    set_Cordinates(val){
        this.ballElem.style.setProperty("--x",val[0]);
        this.ballElem.style.setProperty("--y",val[1]);

    }

    get_ball_radius(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('width'))/2;
    }


    reset(){
       this.set_Cordinates([0,0]);
    }
}