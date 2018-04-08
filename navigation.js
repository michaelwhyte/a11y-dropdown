/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function($){

// Body Element
const body = $.body;
// Nav Dom Elements
// Mobile Menu Toggle Button
const btnMobileMenuToggle = $.querySelector('.menu-toggle');	
// Primary Nav
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
// Select the SubNav Links that are the last link in
// their list
const subNavLastLinks = siteNav.querySelectorAll('.children > li:last-child a'); 
// Screen Reader Text Object	
const srt = {
	expand: 'Expand nav',
	collapse: 'Collapse nav'
}

// Add the "js-on" class to the body.
// This will trigger the subNav items
// to hide. If JavaScript is disabled
// then this script will not run and
// the CSS will default to showing 
// all the subNavs
body.classList.add('js-on');

// Hide open sub navs when body is clicked.
// The click event handler function for  
// the body is written further down and  
// used by other elements
body.addEventListener('click', function(e){
	// Ignore clicks on the body that originate from
	// a dropdown-toggle button
	if(!e.target.classList.contains('dropdown-toggle')){
		hideOtherSubNav();
	}
});

// Current Page
// Add aria-describedby to current menu item if any.
currentPage();

function currentPage() {
	siteNav.querySelector( '.current_page_item, .current_menu_item' )
		   .firstElementChild
		   .setAttribute( 'aria-describedby', 'current' );
}

// Initialize Navigation
navSetup();

function navSetup() {

	// Turn on Mobile Menu Toggle Button for mobile
	btnMobileMenuToggle.classList.remove('hidden');
	
	// Hide siteNavigation using CSS.
	siteNav.classList.add('hidden');

	// Create the subNav buttons
	subNav.forEach(function(el){
		createButton(el);
	});

	// Create subNav buttons and 
	// insert them as the first child of "li" 
	// elements that are drop-downs
	function createButton( el ) {

		// Create button
		const newButton = document.createElement('button');
		// Add class to button
		newButton.classList.add( 'dropdown-toggle' );
		// Set the state of the button
		setBtnState(newButton, false, srt.expand, false);
		// Insert the button into the navigation menu
		el.insertBefore( newButton, el.querySelector( 'ul' ) );
	
	}

}

// Grab the newly created SubNav buttons
const subNavBtn = document.querySelectorAll('.dropdown-toggle');

// Mobile Menu Toggle
btnMobileMenuToggle.addEventListener('click', function(){
	this.getAttribute('aria-expanded') === 'false' ? this.setAttribute('aria-expanded', 'true') : this.setAttribute('aria-expanded', 'false');
	siteNav.classList.toggle('hidden');
});

// Event Handlers for Sub Nav items

// Mousenter event for subNav
subNav.forEach(function(el){
	el.addEventListener('mouseenter', function(){
		el.classList.add('is-hovered');
		hideOtherSubNav();
		setBtnState(el, true, srt.collapse, true);
	});
});

// Mouseleave event for subNav
subNav.forEach(function(el){
	el.addEventListener('mouseleave', function(){
		el.classList.remove('is-hovered');
		setBtnState(el, false, srt.expand, false);
	});
});

// Hide other sub navigation items
// when another sub navigation is 
// hovered or when the user clicks 
// away from  the navigation menu
function hideOtherSubNav(){
	const subNavMainLinksInFocusLength = subNavMainLinksInFocus.length;
	if(subNavMainLinksInFocusLength === 0){
		return;
	}
	for(i = 0; i < subNavMainLinksInFocusLength; i++){
		const subNavToggled = subNavMainLinksInFocus[0].querySelector(':scope .toggled');
		if(subNavToggled){
			subNavToggled.classList.remove('toggled');
		}
		btn = subNavMainLinksInFocus[0].querySelector(':scope .dropdown-toggle');
		setBtnState(btn, false, srt.expand, false);
		subNavMainLinksInFocus[0].classList.remove('is-focused');	
	}
}

// Focus Event for SubNavMainLink
subNavMainLink.forEach(function(el){
	el.addEventListener('focus', showSubNavOnFocus);
});

function showSubNavOnFocus(){
	const parentLi = this.parentElement; 
	const btn = this.nextElementSibling;
	const subList = btn.nextElementSibling;

	parentLi.classList.add('is-focused');
	setBtnState(btn, false, srt.collapse, true);
	subList.classList.add('toggled');
}

// Click Event for SubNavBtn
subNavBtn.forEach(function(el){
	el.addEventListener('click', showAndHideSubNavOnClick);
});

// Shows and hides subNavs on 
// click of the subNav buttons.
// Also changes the state of the 
// subNav buttons
function showAndHideSubNavOnClick(){
	this.textContent === srt.expand ? setBtnState(this, false, srt.collapse, true) : setBtnState(this, false, srt.expand, false);
	this.parentElement.classList.add('is-focused');
	this.nextElementSibling.classList.toggle('toggled');
}

// Keydown event for SubNavMainLinks
subNavMainLink.forEach(function(el){
	el.addEventListener('keydown', function(e){
		hideSubNav(e, this, true);
	});
});

// Keydown event for last link in
// subNav list
subNavLastLinks.forEach(function(el){
	el.addEventListener('keydown', function(e){
		hideSubNav(e, this, false);
	});
});

/**
 * Hide subNav
 * 
 * Hides the subNav on a keyboard event.
 * The subNav that is hidden is dependent on
 * which element triggered the function.
 * If the last element in a subNav list triggered
 * this function, and the "shift" key was not 
 * pressed, then we select the revelant elements to
 * hide. If the element was a subNavMainLink
 * element, and the "shift" key was pressed, then
 * we select the revelant elements to hide
 *
 * @param {Object} e => DOM event object
 * @param {Object} el => HTML DOM element
 * @param {Boolean} shift => look for shift key press or not
 * 
 */
function hideSubNav(e, el, shift){

	if(shift){
		const parentLi = el.parentElement;
		const btn = el.nextElementSibling;
		const subList = btn.nextElementSibling;
		// This snippet based on this Stackoverflow queston and answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab
		if(e.keyCode === 9 && e.shiftKey === true){
			hideNav(btn, subList, parentLi);
		}
	}else{
		const subList = el.parentElement.parentElement;
		const parentLi = subList.parentElement;
		const btn = subList.previousElementSibling;
		// This snippet based on this Stackoverflow question and answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab
		if(e.keyCode === 9 && e.shiftKey === false){
			hideNav(btn, subList, parentLi);
		}	
	}

	function hideNav(button, ul, li){
		
		setBtnState(button, false, srt.expand, false);
		ul.classList.remove('toggled');
		li.classList.remove('is-focused');
	
	}

}

// Utility Functions

/**
 * Set Button State
 *
 * @param {Object} el => HTML DOM element
 * @param {Boolean} disabled => should button be disabled
 * @param {string} text => text to set for the button
 * @param {Boolean} ariaExpanded => set the aria-expanded attribute 
 * 
 */
function setBtnState(el, disabled, text, ariaExpanded){
	
	if(el.nodeName !== 'BUTTON'){
		btns = el.querySelectorAll(':scope > .dropdown-toggle');
		btns.forEach(function(btn){
			if(el.classList.contains('is-focused') && isDisabled){
				btn.disabled = true;
				return;
			}else if(el.classList.contains('is-focused') && !isDisabled){
				btn.disabled = false;
				return;
			}
			disabled ? setBtnState(btn, true, srt.collapse, true) : setBtnState(btn, false, srt.expand, false);
		});
		return;
	}

	el.textContent = text;
	el.setAttribute('aria-expanded', ariaExpanded);
	el.disabled = disabled;

}

})(document);

