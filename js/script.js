let empty_space;
let shapes = ['square','line','l','t','cell'];
let active_elem_position=[];
let active_elements;
let score;
let shape;
let color;
let active_shape_orientation;
let q;
let upcoming;
let front;
document.getElementById('score').innerText = score;

function launch(){
    empty_space = [[-2, 0],[-2, 1],[-2, 2],[-2, 3],[-2, 4],[-2, 5],[-2, 6],[-2, 7],[-1, 0],[-1, 1], [-1, 2], [-1, 3], [-1, 5], [-1, 4],[-1, 6], [-1, 7],];
    active_elem_position=[];
    active_elements=[];
    score=0;
    color=Math.floor(Math.random()*3);
    active_shape_orientation=0;
    upcoming = [];
    front=0;
    document.getElementById('score').innerText = score;

    setTimeout(function(){
        if(document.getElementById('skip')){
            document.getElementById('skip').remove();
        }
    },9500)
    document.getElementById('js-not-enabled').style.display = 'none';
    if(document.getElementsByClassName('grid').length==0){
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
    }
    for(let j=0;j<3;j++){
        upcoming.push(shapes[Math.floor(Math.random()*5)])
    }
    document.getElementById('upcoming').innerHTML='';
    for(let i=0;i<upcoming.length;i++){
        let box = document.getElementById('upcoming');
        let image = document.createElement('img');
        image.src = `css/${upcoming[(front+i)%upcoming.length]}.png`;
        if(upcoming[(front+i)%upcoming.length] == 'line'){
            image.setAttribute('class','nextl');
        }else{
            image.setAttribute('class','next');
        }
        box.appendChild(image);
    }
    if(window.innerWidth < 512){
        document.querySelector('body').style.fontSize = `${window.innerWidth/520}em`;
        if(window.innerHeight<(window.innerWidth*1.25)  ){
            document.querySelector('body').style.fontSize = `${window.innerHeight/640}em`;
        }
    }
    if(localStorage.getItem('numbering')==null){
        localStorage.setItem('numbering','false');
        localStorage.setItem('grid','false');
        localStorage.setItem('guide','true');


    }else{
        let numbering = localStorage.getItem('numbering');
        let grid = localStorage.getItem('grid');
        let guide = localStorage.getItem('guide');

        if(numbering == 'true') {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.color='#555';
            }
        } else {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.color='#222';
                document.getElementById('numbering').checked = '';

            }
        }
        if(grid == 'true') {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.border=' 1px solid #444';
            }

        } else {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.border=' 1px solid #222';
            }    
            document.getElementById('grid').checked = '';
        }
        if(guide == 'true'){
            document.getElementById('guidelines').style.display ='flex';
        }else{
            document.getElementById('guidelines').style.display ='none';
        }
    }
}
launch();

function skipping(){
    document.getElementById('left').getAnimations()[0].finish();
    document.getElementById('right').getAnimations()[0].finish();
    document.getElementById('rotate').getAnimations()[0].finish();
    document.getElementById('drop').getAnimations()[0].finish();
    document.getElementById('Instructions').getAnimations()[0].finish();
    document.getElementById('mobile-instructions').getAnimations()[0].finish();
    document.getElementById('start').getAnimations()[0].finish();
    document.getElementById('skip').remove();
}

function restart(){
    location.reload();
    /*let cell = document.getElementsByClassName('cell');
    let n = cell.length;
    for(let i=0;i<n;i++){
        cell[0].remove();
    }
    launch();
    document.getElementById('gameover').style.display = 'none';
    setTimeout(create,1000);*/
}

function nextshape(){
    shape = upcoming[front]
    upcoming[front]= shapes[Math.floor(Math.random()*5)];
    front+=1;
    front%=upcoming.length;
    document.getElementById('upcoming').innerHTML= '';
    for(let i=0;i<upcoming.length;i++){
        let box = document.getElementById('upcoming');
        let image = document.createElement('img');
        image.src = `css/${upcoming[(front+i)%upcoming.length]}.png`;
        if(upcoming[(front+i)%upcoming.length] == 'line'){
            image.setAttribute('class','nextl');
        }else{
            image.setAttribute('class','next');
        }
        box.appendChild(image);
    }
}

function create(){
    document.getElementById('drop').onclick = drop;
    document.getElementById('start').style.display = 'none';
    nextshape();
    let pos = Math.floor(Math.random()*4);
    let clr=['r','g','b'][color];
    color+=1;
    color%=3;
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
                r=0-2;
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
            active_shape_orientation=0;
            break
        }
        active_elem_position[j]=[r,c];
        cell.setAttribute('class',`cell active ${clr}`);
        cell.style.top = `${r*4}em`;
        cell.style.left = `${c*4}em`;
        document.getElementById('main').appendChild(cell);

    }
    active_shape_orientation=0;
    movedown(500);
}



function movedown(speed){
    active_elements = document.querySelectorAll('.active');
    q =setInterval(
        function(){
            if(movepossible('down')){
                for(let j = 0;j<active_elements.length;j++){
                    active_elem_position[j][0]+=1;
                    active_elements[j].style.top = `${active_elem_position[j][0]*4}em`;
                }
            }else{
                for(let j=0;j<active_elements.length;j++){
                    active_elements[j].classList.remove("active");
                }
                score+=active_elements.length;
                for(let l=0;l<active_elements.length;l++){
                    if(parseInt(active_elements[l].style.top.split('e')[0]/4) < 1 ){
                        document.getElementById('gameover').style.display = 'block';
                        clearInterval(q)
                        return
                    }
                }
                document.getElementById('score').innerText = score;
                active_elements=[];
                clearInterval(q);
                setTimeout(create,500);

            }
        }
    ,speed)
}
function moveright(){
    if(movepossible('right')){
        for(let j = 0;j<active_elements.length;j++){
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
function drop(){
    document.getElementById('drop').onclick = '';
    clearInterval(q);
    movedown(40);
}
function rotation_check(arr,n){
    let occur;
    for(let i =0;i<arr.length;i++){
        occur = false
        if(i!=n){
            for(let j=0;j<empty_space.length;j++){
                if(arr[i][0]==empty_space[j][0] && arr[i][1]==empty_space[j][1]){
                    occur = true;
                    break
                }
            }
            if(occur){
                continue
            }else{
                return false
            }
        }
    }
    return true
}

function rotate(){
    switch(shape){
        case 'line':{
            let r = active_elem_position[1][0];
            let c = active_elem_position[1][1];
            let pos;
            if(active_elem_position[0][0]==active_elem_position[1][0] ){
                pos = [[r-1,c],[r,c],[r+1,c],[r+2,c]];
                
            }else{
                pos = [[r,c-1],[r,c],[r,c+1],[r,c+2]];
            }
            if(rotation_check(pos,1)){
                for(let i=0;i<active_elements.length;i++){
                    active_elements[i].style.left = `${pos[i][1]*4}em`;
                    active_elements[i].style.top = `${pos[i][0]*4}em`;
                    active_elem_position[i]=pos[i];
                }
            }
            break
            
        }
        case 'l':{
            let r = active_elem_position[2][0];
            let c = active_elem_position[2][1];
            let pos;
            if(active_shape_orientation==0){
                pos = [[r,c+2],[r,c+1],[r,c],[r+1,c]];
            }else if(active_shape_orientation==90){
                pos = [[r,c-1],[r+1,c],[r,c],[r+2,c]]
            }else if(active_shape_orientation==180){
                pos = [[r,c-2],[r,c-1],[r,c],[r-1,c]]
            }else if(active_shape_orientation==270){
                pos = [[r-2,c],[r-1,c],[r,c],[r,c+1]]
            }
            if(rotation_check(pos,2)){
                for(let i=0;i<active_elements.length;i++){
                    active_elements[i].style.left = `${pos[i][1]*4}em`;
                    active_elements[i].style.top = `${pos[i][0]*4}em`;
                    active_elem_position[i]=pos[i];
                }
                active_shape_orientation+=90;
                active_shape_orientation%=360;
            }
            break
        }
        case 't':{
            let r = active_elem_position[2][0];
            let c = active_elem_position[2][1];
            let pos;
            if(active_shape_orientation==0){
                pos = active_elem_position;
                pos[1] = [r+1,c];
                if(rotation_check(pos,2)){
                active_elements[1].style.top =  `${(r+1)*4}em`;
                active_elements[1].style.left =  `${c*4}em`;
                active_elem_position[1]=pos[1]
                }
            }else if(active_shape_orientation==90){
                pos=active_elem_position;
                pos[0] = [r,c-1];
                if(rotation_check(pos,2)){
                    active_elements[0].style.top =  `${r*4}em`;
                    active_elements[0].style.left =  `${(c-1)*4}em`;
                    active_elem_position[0]=pos[0]
                }
            }else if(active_shape_orientation==180){
                pos=active_elem_position;
                pos[3] = [r-1,c];
                if(rotation_check(pos,2)){
                    active_elements[3].style.top =  `${(r-1)*4}em`;
                    active_elements[3].style.left =  `${c*4}em`;
                    active_elem_position[3]=pos[3];
                }
            }else if(active_shape_orientation==270){
                pos=active_elem_position;
                pos[1] = [r,c+1];
                if(rotation_check(pos,2)){
                    active_elements[1].style.top =  `${r*4}em`;
                    active_elements[1].style.left =  `${(c+1)*4}em`;
                    active_elem_position[1]=pos[1];
                }
            }
            active_shape_orientation+=90;
            active_shape_orientation%=360;
            break
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
    let ans;
    for(let r=0;r<10;r++){
        ans = false;
        if(empty_space.filter(value => value[0]==r).length == 0){
            ans=true;
            score+=30;
            document.getElementById('score').innerText = score;
            cells = document.querySelectorAll('.cell');
            //cells = cells.filter(value => value.style.display!='none');
            for(let i=0;i<cells.length;i++){
                if(cells[i].style.top ==`${r*4}em`){
                    cells[i].remove();
                    let add_r=parseInt(cells[i].style.top.split("e")[0]/4);
                    let add_c=parseInt(cells[i].style.left.split("e")[0]/4);
                    empty_space.push([add_r,add_c]);
                }
            }
            row_shift(r);
        }
        
    }
    if(ans){
        row_check();
    }else{
        return
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



$(function(){
    $(document).keyup(function() {
      let e = window.event.keyCode;
        if(e==37){
            moveleft();
        }else if(e==39){
            moveright();
        }else if(e==32){
            rotate();
        }else if(e==40){
            drop();
        }
    });
  });
var info_showing=false;
var options_show=false;
function info_show(){
    if(!info_showing){
        document.getElementsByClassName('infop')[0].style.display='flex';
        document.getElementsByClassName('infop')[0].style.opacity='1';
        document.getElementsByClassName('infop')[0].style.zIndex=4;

        info_showing=true;
    }else{
        document.getElementsByClassName('infop')[0].style.display= 'none';
        document.getElementsByClassName('infop')[0].style.opacity='0';
        document.getElementsByClassName('infop')[0].style.zIndex=-1;

        info_showing=false;
    }
}
function options(){
    if(!options_show){
        document.getElementsByClassName('settings-menu')[0].style.display='flex';
        document.getElementsByClassName('settings-menu')[0].style.opacity='1';
        document.getElementsByClassName('settings-menu')[0].style.zIndex = 6;
        document.getElementsByClassName('close')[0].style.display = 'block';
        document.getElementsByClassName('close')[0].style.zIndex = 5;
        options_show=true;
    }else{
        document.getElementsByClassName('settings-menu')[0].style.display='none';
        document.getElementsByClassName('settings-menu')[0].style.opacity='0';
        document.getElementsByClassName('settings-menu')[0].style.zIndex =1;
        document.getElementsByClassName('close')[0].style.zIndex =0;
        document.getElementsByClassName('close')[0].style.display = 'none';
        options_show=false;

    }
}

var checkbox = document.querySelectorAll("input[type=checkbox]");
for(let i = 0;i<checkbox.length;i++){
    
  checkbox[i].addEventListener( 'change', function() {
    if(this.name=='grid'){
        if(this.checked) {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.border=' 1px solid #444';
                localStorage.setItem('grid','true');
            }
        } else {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.border=' 1px solid #222';
                localStorage.setItem('grid','false');

            }    
        }
    }else if(this.name=='numbering'){
        if(this.checked) {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.color='#555';
                localStorage.setItem('numbering','true');
            }
        } else {
            for(let j=0;j<80;j++){
                document.getElementById(`${j}`).style.color='#222';
                localStorage.setItem('numbering','false');
            }    
        }
    }else if(this.name=='guide'){
        if(this.checked) {
            document.getElementById('guidelines').style.display = 'flex';
            localStorage.setItem('guide','true');

        } else {
            document.getElementById('guidelines').style.display = 'none';
            localStorage.setItem('guide','false');
   
        }
    }
    
});
}
