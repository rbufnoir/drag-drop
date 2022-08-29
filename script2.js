let x;
let y;
let placeholder;
let dragElem;

function swap(nodeA, nodeB) {
	const parentA = nodeA.parentNode;
	const siblingA = (nodeA.nextSibling === nodeB) ? nodeA: nodeA.nextSibling;

	nodeB.parentNode.insertBefore(nodeA, nodeB);
	parentA.insertBefore(nodeB, siblingA);
}

function mouseDownHandler(e) {
    dragElem = e.target;
    const rect = dragElem.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

    placeholder = document.createElement("div");
    dragElem.before(placeholder);
    
    document.addEventListener('mousemove', mouseMouveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
}

function mouseMouveHandler(e) {

    placeholder.style.height = dragElem.offsetHeight + "px";
	placeholder.style.width = dragElem.offsetWidth + "px";

    dragElem.style.position = "absolute";
    dragElem.style.zIndex = -1;
    dragElem.style.top = (e.pageY - y) + 'px';
    dragElem.style.left = (e.pageX - x) + 'px';

    if (document.getElementById('draggable').contains(e.target)) {
        if (e.target != placeholder && e.target.parentNode === dragElem.parentNode && e.target.localName === dragElem.localName)
            swap(placeholder, e.target);
        else if (e.target != placeholder && e.target.parentNode.localName === dragElem.parentNode.localName)
            e.target.before(placeholder);
    }
}

function mouseUpHandler() {
    dragElem.style.removeProperty('top');
    dragElem.style.removeProperty('left');
    dragElem.style.removeProperty('position');
    dragElem.style.removeProperty('z-index');
    
    placeholder.parentNode.replaceChild(dragElem, placeholder);
    placeholder.remove()
    
    x = null;
    y = null;
    dragElem = null;

    document.removeEventListener('mousemove', mouseMouveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
}

document.getElementById('draggable').addEventListener('mousedown', mouseDownHandler);

document.getElementById('button').addEventListener('click', () => {
    let newLi = document.createElement('li');
    let id = Math.floor(Math.random() * 50 + 10);
    let option = parseInt(document.getElementById('select').value.slice(8))
    newLi.innerText = id;
    newLi.setAttribute('id', id);

    document.getElementById('draggable').children[option - 1].appendChild(newLi);
});