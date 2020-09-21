let empty_space = [[-2, 0],[-2, 1],[-2, 2],[-2, 3],[-2, 4],[-2, 5],[-2, 6],[-2, 7],[-1, 0],[-1, 1], [-1, 2], [-1, 3], [-1, 5], [-1, 4],[-1, 6], [-1, 7],];
let shapes = ['square','line','l','t','cell']
let active_elem_position=[];
let active_elements;
let score=0;
document.getElementById('score').innerText = score;

function launch(){
    document.getElementById('js-not-enabled').style.display = 'none';
    for(let i =0;i<80;i++){
        let main = document.getElementById('main');
        let box = document.createElement('span');
        box.setAttribute('class','grid');
        box.setAttribute('id',i);
        let n = document.createTextNode(`${parseInt(i/8)} , ${i%8}`);
        empty_space.push([parseInt(i/8),i%8]);
        box.appendChild(n);
        main.appendChild(box);
    }
    if(window.innerWidth < 512){
        document.querySelector('body').style.fontSize = `${window.innerWidth/520}em`;
        if(window.innerHeight<(window.innerWidth*1.25)  ){
            document.querySelector('body').style.fontSize = `${window.innerHeight/640}em`;
        }
    }
    
}
launch();


function create(){
    document.getElementById('start').style.display = 'none';
    let shape = shapes[Math.floor(Math.random()*5)]/*Math.floor(Math.random()*4)*/
    let pos = Math.floor(Math.random()*4);
    let clr=['r','g','b'][Math.floor(Math.random()*3)];
    for(let j = 0;j<4;j++){
        let cell = document.createElement('span');
        let r;
        let c;
        if(shape=='square'){
            r = parseInt(j/2)-2;
            c = (j%2)+pos;
            
        }else if(shape=='line'){
            cell.setAttribute('class','cell');
            r = -2;
            c = pos+j;
        }else if(shape=='l'){
            cell.setAttribute('class','cell');
            if(j<3){
                r=j-2;
                c=pos;
            }else{
                r=j-1-2;
                c=pos+1;
            }
        }else if(shape=='t'){
            cell.setAttribute('class','cell');
            r = 1-2;
            c = pos+j-1;
            if(j==0){
                r=0;
                c=pos+1;
            }
        }else if(shape=='cell'){
            cell.setAttribute('class','cell');
            r = 0;
            c = pos;
            if(j==0){
                r=0;
                c=pos+1;
            }
            active_elem_position[j]=[r,c];
            cell.setAttribute('class',`cell active ${clr}`);
            cell.style.top = `${r*4}em`;
            cell.style.left = `${c*4}em`;
            document.getElementById('main').appendChild(cell);
            break
        }
        active_elem_position[j]=[r,c];
        cell.setAttribute('class',`cell active ${clr}`);
        cell.style.top = `${r*4}em`;
        cell.style.left = `${c*4}em`;
        document.getElementById('main').appendChild(cell);
    }
    console.log('shape:',shape)
    movedown();
}



function movedown(){
    active_elements = document.querySelectorAll('.active');
    let q =setInterval(
        function(){
            if(movepossible('down')){
                for(let j = 0;j<active_elements.length;j++){
                    active_elem_position[j][0]+=1;
                    active_elements[j].style.top = `${active_elem_position[j][0]*4}em`;
                    //active_elements[j].innerHTML=`${active_elem_position[j]}`
                }
            }else{
                for(let j=0;j<active_elements.length;j++){
                    active_elements[j].classList.remove("active");
                }
                score+=active_elements.length;
                document.getElementById('score').innerText = score;
                active_elements=[];
                clearInterval(q);
                setTimeout(create,500);

            }
        }
    ,500)
}
function moveright(){
    if(movepossible('right')){
        for(let j = 0;j<4;j++){
            active_elem_position[j][1]+=1;
            active_elements[j].style.left = `${active_elem_position[j][1]*4}em`;
        }
    }
}
function moveleft(){
    if(movepossible('left')){
        for(let j = 0;j<active_elements.length;j++){
            active_elem_position[j][1]-=1;
            active_elements[j].style.left = `${active_elem_position[j][1]*4}em`;
        }
    }
}
function del_form_list(x,y){
    for(let i=0;i<empty_space.length;i++){
        if(empty_space[i][0]==x && empty_space[i][1]==y){
            empty_space.splice(i,1);
            return
        }
    }
}
let cells = document.querySelectorAll('.cell');

function row_check(){
    for(let r=0;r<10;r++){
        if(empty_space.filter(value => value[0]==r).length == 0){
            score+=30;
            document.getElementById('score').innerText = score;
            cells = document.querySelectorAll('.cell');
            //cells = cells.filter(value => value.style.display!='none');
            for(let i=0;i<cells.length;i++){
                if(cells[i].style.top ==`${r*4}em`){
                    cells[i].style.display = 'none';
                    let add_r=parseInt(cells[i].style.top.split("e")[0]/4);
                    let add_c=parseInt(cells[i].style.left.split("e")[0]/4);
                    empty_space.push([add_r,add_c]);
                }
            }
            row_shift(r);
            return
        }
    }
}

function row_shift(r){
    r-=1;
    while(r>0){
        for(let i=0;i<cells.length;i++){
            if(cells[i].style.top.split('e')[0] ==  r*4){
                let new_r =parseInt(cells[i].style.top.split("e")[0]/4)+1;
                let new_c =parseInt(cells[i].style.left.split("e")[0]/4);
                cells[i].style.top = `${new_r*4}em`;
                empty_space.push([new_r-1,new_c]);
                del_form_list(new_r,new_c);
            }
        }
        r-=1;
    }
}


function movepossible(direction){
    if(direction == 'down'){
        for(let j=0;j<active_elements.length;j++){
            let r = active_elem_position[j][0]+1;
            let c = active_elem_position[j][1];
            let occurance= false;
            for(let k = 0;k<empty_space.length;k++){
                if(empty_space[k][0]==r && empty_space[k][1]==c){
                    occurance=true
                    break
                }
            }if(occurance){
                continue
            }else{
                for(let i=0;i<active_elements.length;i++){
                    r= active_elem_position[i][0]+1;
                    c=active_elem_position[i][1];
                    del_form_list(r-1,c);
                }
                row_check()
                return false
            }
        }
        return true
    }else if(direction=='right'){
        for(let j=0;j<active_elements.length;j++){
            let r = active_elem_position[j][0];
            let c = active_elem_position[j][1]+1;
            let occurance= false;
            for(let k = 0;k<empty_space.length;k++){
                if(empty_space[k][0]==r && empty_space[k][1]==c){
                    occurance=true
                    break
                }
            }if(occurance){
                continue
            }else{
                return false
            }
        }
        return true
    }else if(direction=='left'){
        for(let j=0;j<active_elements.length;j++){
            let r = active_elem_position[j][0];
            let c = active_elem_position[j][1]-1;
            let occurance= false;
            for(let k = 0;k<empty_space.length;k++){
                if(empty_space[k][0]==r && empty_space[k][1]==c){
                    occurance=true
                    break
                }
            }if(occurance){
                continue
            }else{
                return false
            }
        }
        return true
    }
}



$(function(){ // this will be called when the DOM is ready
    $(document).keyup(function() {
      let e = window.event.keyCode;
        if(e==37){
            moveleft();
        }else if(e==39){
            moveright();
        }
    });
  });





















/*
---------------------------------------------
use this to access all active elements
console.log(document.querySelectorAll('.active'))

---------------------------------------------
Use this to eliminate coordinate after moving stops
if(JSON.stringify(list).includes(JSON.stringify([x,y]))){
    console.log('yes');
    console.log(list[x*8+y],x,y)
}else{
}
*/



/*function create(shape){
    let sh = document.createElement('span');
    sh.setAttribute('class',shape);
    sh.setAttribute('id','active');
    for(let j = 0;j<4;j++){
        let box1 = document.createElement('span');
        box1.setAttribute('class','cell');
        sh.appendChild(box1);
    }
    let top = 0;
    let left = 0;        
    document.getElementById("main").appendChild(sh);
    sh.style.top = `${top}em`;
    sh.style.left = `${left}em`;
    movedown()
}

function movedown(){
    let sh = document.getElementById("active");
    let top = 0;
    let left = 0;
    let q = setInterval(function(){
        if(top<8){
            top+=1;
            sh.style.top = `${top*4}em`;
            sh.style.left = `${left*4}em`;
        }else{
            clearInterval(q);
            console.log(top,left,sh.querySelectorAll(".cell")[0])
        }
    },500)
}
create('square')
*/
