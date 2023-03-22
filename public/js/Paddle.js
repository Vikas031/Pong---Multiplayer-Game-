export default class Paddle{
    constructor(paddleElem){
        this.paddleElem=paddleElem;
    }

    gety(){
        return parseInt(getComputedStyle(this.paddleElem).getPropertyValue("--y"));
    }

    sety(value){
        this.paddleElem.style.setProperty("--y",value);
    }

    reset(){
        this.sety(0);
    }
}