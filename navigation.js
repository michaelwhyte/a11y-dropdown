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
// Select the Parent Links that are currently in focus
// *** Note: We use "getElementsByClassName" here as this makes the
// selection live, meaning it is constantly updated when elements
// have a class added or removed. On the downside we loose handy 
// helper functions like "forEach"
const subNavMainLinksInFocus = $.getElementsByClassName('is-focused');
// Select the SubNav "ul" elements
const subNavList = siteNav.querySelectorAll('.children');
// Select the SubNav Links
const subNavLinks = siteNav.querySelectorAll('.children > li > a');
// Select the SubNav Links that are the last link in
// their list
const subNavLastLinks = siteNav.querySelectorAll('.children > li:last-child a'); 
// Screen Reader Text Object	
const srt = {
	expand: 'Expand nav',
	collapse: 'Collapse nav'
}

const body = $.body;
const body2 = $.querySelector('body');

console.log(body2);

body.addEventListener('click', function(){
	//console.log('hello')
	hideOtherSubNav();
});

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
		el.classList.add('is-hovered');
		hideOtherSubNav();
		setBtnState(el, true);
	});
});

function hideOtherSubNav(){
	for(i = 0; i < subNavMainLinksInFocus.length; i++){
		if(subNavMainLinksInFocus[i].querySelector(':scope .toggled')){
			subNavMainLinksInFocus[i].querySelector(':scope .toggled').classList.remove('toggled');
		}
		btn = subNavMainLinksInFocus[i].querySelector(':scope .dropdown-toggle');
		btn.textContent = srt.expand;
		btn.setAttribute( 'aria-expanded', 'false' )							
		subNavMainLinksInFocus[i].classList.remove('is-focused');		
	}
}

// Mouseleave event for subNav
subNav.forEach(function(el){
	el.addEventListener('mouseleave', function(){
		el.classList.remove('is-hovered');
		setBtnState(el, false);
	});
});

function setBtnState(el, isDisabled){
	//mainLink = el.firstElementChild;
	btns = getChildren(el, '.dropdown-toggle');
	btns.forEach(function(btn){
		if(el.classList.contains('is-focused') && isDisabled){
			btn.disabled = true;
			return;
		}else if(el.classList.contains('is-focused') && !isDisabled){
			btn.disabled = false;
			return;
		}
		isDisabled ? btn.textContent = srt.collapse : btn.textContent = srt.expand;
		isDisabled ? btn.setAttribute( 'aria-expanded', 'true' ) : btn.setAttribute( 'aria-expanded', 'false' );
		btn.disabled = isDisabled;
	});
};

// Change the aria-expanded and button text to match current button behavior.
// let toggleButton = subNav.querySelector( '.dropdown-toggle' );
// 'false' === toggleButton.getAttribute( 'aria-expanded' ) ? toggleButton.setAttribute( 'aria-expanded', 'true' ) : toggleButton.setAttribute( 'aria-expanded', 'false' );
// toggleButton.textContent = ( toggleButton.textContent === screenReaderText.expand ? screenReaderText.collapse : screenReaderText.expand );

// Focus Event for SubNavMainLink
subNavMainLink.forEach(function(el){
	el.addEventListener('focus', showSubNavOnFocus);
});

function showSubNavOnFocus(e){

	const parentLi = this.parentElement; 
	const btn = this.nextElementSibling;
	const subList = btn.nextElementSibling;

	parentLi.classList.add('is-focused');
	btn.textContent = srt.collapse;
	btn.setAttribute( 'aria-expanded', 'true' );
	subList.classList.add('toggled');

}

// Keydown Event for SubNavMainLink
// *** This uses the same function as
// the subNavLastLinks keydown event
subNavMainLink.forEach(function(el){
	el.addEventListener('keydown', function(e){
		hideSubNav(e, this, true);
	});
});

// Click Event for SubNavBtn
subNavBtn.forEach(function(el){
	el.addEventListener('click', showAndHideSubNavOnClick);
});

function showAndHideSubNavOnClick(){
	this.textContent === srt.expand ? this.setAttribute( 'aria-expanded', 'true' ) : this.setAttribute( 'aria-expanded', 'false' );
	this.textContent === srt.expand ? this.textContent = srt.collapse : this.textContent = srt.expand;
	this.nextElementSibling.classList.toggle('toggled');
}

// Keydown Event for last link in
// Sub Nav list
subNavLastLinks.forEach(function(el){
	el.addEventListener('keydown', function(e){
		hideSubNav(e, this, false);
	});
});

function hideSubNav(e, el, shift){

	if(shift){
		const parentLi = el.parentElement;
		const btn = el.nextElementSibling;
		const subList = btn.nextElementSibling;
		// This snippet based on this Stackoverflow queston and answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab
		if(e.keyCode === 9 && e.shiftKey === true){
			parentLi.classList.remove('is-focused');
			subList.classList.remove('toggled');
			btn.textContent = srt.expand;
			btn.setAttribute( 'aria-expanded', 'false' );
		}
	}else{
		const subList = el.parentElement.parentElement;
		const parentLi = subList.parentElement;
		const btn = subList.previousElementSibling;
		const mainLink = btn.previousElementSibling;
		// This snippet based on this Stackoverflow question and answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab
		if(e.keyCode === 9 && e.shiftKey === false){
			subList.classList.remove('toggled');
			btn.textContent = srt.expand;
			btn.setAttribute( 'aria-expanded', 'false' );
			parentLi.classList.remove('is-focused');
		}	
	}

}

// Utility Functions

// This code was modified from from this Stackoverflow question and answer to
// accept a selector filter:
// https://stackoverflow.com/questions/842336/is-there-a-way-to-select-sibling-nodes
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

})(document);

