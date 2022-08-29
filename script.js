let x = 0;
let y = 0;
let placeholder;
let dragStart = false;
let dragElem;
let parents = [];
let direction;

function isAbove(nodeA, nodeB) {
	const rectA = nodeA.getBoundingClientRect();
	const rectB = nodeB.getBoundingClientRect();

	// return (rectA.top + rectA.height) / 2 < (rectB.top + rectB.height) / 2
	// return (rectA.left + rectA.width) / 2 < (rectB.left + rectB.width) / 2

	return (direction === 'horizontal') ? (rectA.left + rectA.width) / 2 < (rectB.left + rectB.width) / 2 : (rectA.top + rectA.height) / 2 < (rectB.top + rectB.height) / 2;
}

function isAboveParent(child, parent) {
	const rectChild = child.getBoundingClientRect();
	const rectParent = parent.getBoundingClientRect();

	xChild = rectChild.left + rectChild.width / 2 
	yChild = rectChild.top + rectChild.height / 2

	return (xChild > rectParent.left && xChild < rectParent.right && yChild > rectParent.top && yChild < rectParent.bottom);
}

function getParents(dragElem) {
	let grandParent = dragElem.parentNode.parentNode;
	let parents = []

	for (i = 0; i < grandParent.children.length; i++)
		parents.push(grandParent.children[i]);
}

function swap(nodeA, nodeB) {
	const parentA = nodeA.parentNode;
	const siblingA = (nodeA.nextSibling === nodeB) ? nodeA: nodeA.nextSibling;

	nodeB.parentNode.insertBefore(nodeA, nodeB);
	parentA.insertBefore(nodeB, siblingA);
}

const mouseDownHandler = function (e) {
	dragElem = e.target;

	const rect = dragElem.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

	if (dragElem.nextElementSibling && dragElem.offsetTop === dragElem.nextElementSibling.offsetTop || dragElem.previousElementSibling && dragElem.offsetTop === dragElem.previousElementSibling.offsetTop)
		direction = 'horizontal';
	else
		direction = 'vertical';

	e.stopPropagation();
	document.addEventListener('mousemove', mouseMouveHandler);
	document.addEventListener('mouseup', mouseUpHandler);
}

const mouseMouveHandler = function (e) {
	const rect = dragElem.getBoundingClientRect();
	const prevElem = dragElem.previousElementSibling;
	const nextElem = dragElem.nextElementSibling;
	const prevParent = dragElem.parentNode.previousElementSibling;
	const nextParent = dragElem.parentNode.nextElementSibling;

	if (!dragStart) {
		dragStart  = true;

		placeholder = document.createElement("div");
		placeholder.classList.add('placeholder');
		dragElem.before(placeholder);
	}

	placeholder.style.height = rect.height + "px";
	placeholder.style.width = rect.width + "px";
	placeholder.style.background = "red";

	dragElem.style.position = "absolute";
	dragElem.style.top = (e.pageY - y) + 'px';
	dragElem.style.left = (e.pageX - x) + 'px';

	if (prevParent && isAboveParent(dragElem, prevParent)) {
		dragElem = dragElem.parentNode.removeChild(dragElem);
		console.log("prev", dragElem)
		prevParent.appendChild(placeholder)
		prevParent.appendChild(dragElem);
		console.log("Je suis au dessus de mon parent precendent");
	}

	if (nextParent && isAboveParent(dragElem, nextParent)){
		dragElem = dragElem.parentNode.removeChild(dragElem);
		nextParent.appendChild(placeholder)
		nextParent.appendChild(dragElem);
		console.log("Je suis au dessus de mon parent suivant");
	}

	if(prevElem && isAbove(dragElem, prevElem)) {
		console.log("salut");
		swap(placeholder, dragElem);
		swap(placeholder, prevElem);
	}

	if(nextElem && isAbove(nextElem, dragElem)) {
		console.log("coucou");
		swap(nextElem, placeholder);
		swap(nextElem, dragElem);
	}
}

const mouseUpHandler = function() {
	dragElem.style.removeProperty('top');
    dragElem.style.removeProperty('left');
    dragElem.style.removeProperty('position');

	// placeholder && placeholder.parentNode.removeChild(placeholder);
	placeholder && placeholder.remove();
	dragStart = false;

    x = null;
    y = null;
    dragElem = null;

	document.removeEventListener('mousemove', mouseMouveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
}

document.getElementById('draggable').addEventListener('mousedown', mouseDownHandler);

// Array.from(document.getElementsByClassName("item")).forEach(element => {
// 	element.addEventListener('mousedown', mouseDownHandler);
// });

// document.addEventListener('mousemove', (e) => {console.log(e.target)})