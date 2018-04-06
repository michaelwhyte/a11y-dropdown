/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function($){

// Nav Dom Elements	
const siteNav = $.querySelector('#primary-menu ul');
// Select the subNav elements
const subNav = siteNav.querySelectorAll('.page_item_has_children');
// Select the Parent Links in the SubNav
const subNavMainLink = siteNav.querySelectorAll('.page_item_has_children > a:first-child');
// Select the SubNav "ul" elements
const subNavList = siteNav.querySelectorAll('.children');
// Select the SubNav Links
const subNavLinks = siteNav.querySelectorAll('.children > li > a');
// Screen Reader Text Object	
const srt = {
	expand: 'Expand nav',
	collapse: 'Collapse nav'
}

// Current Page
// Add aria-describedby to current menu item if any.
function currentPage() {
	siteNav.querySelector( '.current_page_item, .current_menu_item' )
		   .firstElementChild
		   .setAttribute( 'aria-describedby', 'current' );
}
currentPage();

// Initialize Navigation
function navSetup() {

	// Find drop-downs, add a toggle button to them.
	function createButton( el ) {
		
		const buttonText = document.createTextNode( srt.expand );
		const newButton = document.createElement( 'button' );

		newButton.classList.add( 'dropdown-toggle' );
		newButton.setAttribute( 'aria-expanded', 'false' );
		newButton.appendChild( buttonText );

		el.insertBefore( newButton, el.querySelector( 'ul' ) );
	
	}

	subNav.forEach(function(el){
		createButton(el);
	});

};

navSetup();

// Grab the newly created SubNav buttons
const subNavBtn = document.querySelectorAll('.dropdown-toggle');

// Event Handlers for Sub Nav items

// Mousenter event for subNav
subNav.forEach(function(el){
	el.addEventListener('mouseenter', function(){
		setBtnState(el, true);
	});
});

// Mouseleave event for subNav
subNav.forEach(function(el){
	el.addEventListener('mouseleave', function(){
		setBtnState(el, false);
	});
});

function setBtnState(el, isDisabled){
	btns = getChildren(el, '.dropdown-toggle');
	btns.forEach(function(btn){
		btn.disabled = isDisabled;
	});
};

// Focus Event for SubNavMainLink
subNavMainLink.forEach(function(el){
	el.addEventListener('focus', showSubNavOnFocus);
});

function showSubNavOnFocus(e){

	console.log(e.target);

	const btn = this.nextElementSibling;
	const subList = btn.nextElementSibling;

	// if(subList.classList.contains('toggled')){
	// 	subList.classList.remove('toggled');
	// 	btn.textContent = srt.expand;
	// 	return;
	// }

	btn.textContent = srt.collapse;
	subList.classList.add('toggled');

}

// Click Event for SubNavBtn
subNavBtn.forEach(function(el){
	el.addEventListener('click', showSubNavOnClick);
});

function showSubNavOnClick(){
	this.textContent === srt.expand ? this.textContent = srt.collapse : this.textContent = srt.expand;
	console.log(this.nextElementSibling.classList);
	this.nextElementSibling.classList.toggle('toggled');
}









subNavList.forEach(function(el){
	el.addEventListener('focusin', test)
});

subNavList.forEach(function(el){
	el.addEventListener('focusout', test2)
});

function test(){
	//console.log('Hello from ul...');
}

function test2(){
	//console.log('focusout from ul...');
}

// Blur Event


// Utility Functions

// Get Sibling Elements with Filter
// The getSiblings() and getChildren() code has been customized by @michaelwhyte
// from code found on this Stackoverflow question:
// https://stackoverflow.com/questions/842336/is-there-a-way-to-select-sibling-nodes
//
// The code from the stackoverflow question is based on
// jQuery's siblings() code
// function getSiblings(n, filter) {
//     return getChildren(n.parentNode.firstChild, n, filter);
// }

// // Get Children Elements
// function getChildren(n, skipMe, filter){
//     let r = [];
//     for ( ; n; n = n.nextSibling ){ 
//        if ( n.nodeType == 1 && n != skipMe){
// 		   	if(filter){
// 				if(n.matches(filter)){
// 					r.push( n );
// 				}
// 			}else{
// 				r.push( n );
// 			}			
// 	   }		  
// 	}        
//     return r;
// }

function getChildren(parentElement, filter){
	let r = [];
	n = parentElement.firstElementChild;
    for ( ; n; n = n.nextElementSibling ){ 
		if(filter){
			if(n.matches(filter)){
				r.push( n );
			}
		}else{
			r.push(n);
		}				  
	}        
    return r;
}


// Get Siblings of an Element
// Source: https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/
// function getSiblings(el, filter) {
// 	var siblings = [];
// 	console.log(filter);
//     el = el.parentNode.firstChild;
//     do { if (!filter || filter(el)) siblings.push(el); } while (el = el.nextSibling);
//     return siblings;
// }

// // example filter function
// function exampleFilter(el) {
//     return elem.nodeName.toLowerCase() == 'ul';
// }

// usage
//el = document.querySelector('div');
// get all siblings of el
//var sibs = getSiblings(el);
// get only anchor element siblings of el
//var sibs_a = getSiblings(el, exampleFilter);

})(document);

