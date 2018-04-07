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
// Select the SubNav Links that are the last link in
// their list
const subNavLastLinks = siteNav.querySelectorAll('.children > li:last-child a'); 
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
		isDisabled ? btn.textContent = srt.collapse : btn.textContent = srt.expand;
		btn.disabled = isDisabled;
	});
};

// Focus Event for SubNavMainLink
subNavMainLink.forEach(function(el){
	el.addEventListener('focus', showSubNavOnFocus);
});

function showSubNavOnFocus(e){

	const btn = this.nextElementSibling;
	const subList = btn.nextElementSibling;

	btn.textContent = srt.collapse;
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
	this.textContent === srt.expand ? this.textContent = srt.collapse : this.textContent = srt.expand;
	console.log(this.nextElementSibling.classList);
	this.nextElementSibling.classList.toggle('toggled');
}

// Keydown Event for last link in
// Sub Nav list
subNavLastLinks.forEach(function(el){
	//el.addEventListener('blur', hideSubNav);
	el.addEventListener('keydown', function(e){
		hideSubNav(e, this, false);
	});
});

function hideSubNav(e, el, shift){
	//const subList = this.parentElement.parentElement;
	//const btn = subList.previousElementSibling;

	//console.log(e.shiftKey);
	//console.log(e.keyCode);

	if(shift){
		const btn = el.nextElementSibling;
		const subList = btn.nextElementSibling;
		// This snippet based on this Stackoverflow
		// answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
		if(e.keyCode === 9 && e.shiftKey === true){
			subList.classList.remove('toggled');
			btn.textContent = srt.expand;
		}
	}else{
		const subList = el.parentElement.parentElement;
		const btn = subList.previousElementSibling;
		// This snippet based on this Stackoverflow
		// answer:
		// https://stackoverflow.com/questions/3044083/what-is-the-key-code-for-shifttab?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
		if(e.keyCode === 9 && e.shiftKey === false){
			subList.classList.remove('toggled');
			btn.textContent = srt.expand;
		}	
	}

}

// Utility Functions
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

